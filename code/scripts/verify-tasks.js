const https = require('https');
const opts = {
  hostname: 'api.clickup.com',
  headers: { 'Authorization': 'pk_284457202_0WIIM5RW142E8VRC52N1EZODA4G5C3EH' }
};

const lists = [
  ['901325630675', 'Levee-Calendario'],
  ['901325630681', 'Levee-Tarefas'],
  ['901325630688', 'Levee-Estrategia'],
  ['901325630692', 'Levee-App'],
  ['901325630679', 'Caracol-Calendario'],
  ['901325630683', 'Caracol-Tarefas'],
  ['901325630689', 'Caracol-Estrategia'],
  ['901325630680', 'Pelicula-Calendario'],
  ['901325630685', 'Pelicula-Tarefas'],
  ['901325630690', 'Pelicula-Funis'],
  ['901325630697', 'Pelicula-Produtos'],
  ['901325630710', 'Interno-Receitas'],
  ['901325630714', 'Interno-Capacidade'],
  ['901325630719', 'Interno-SOPs'],
  ['901325630723', 'Interno-Prompts'],
  ['901325630728', 'Interno-Onboarding'],
  ['901325630721', 'Interno-Templates']
];

let completed = 0;
let allTasks = [];

lists.forEach(([listId, label]) => {
  const req = https.get({...opts, path: '/api/v2/list/' + listId + '/task'}, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      try {
        const j = JSON.parse(data);
        (j.tasks || []).forEach(t => {
          const p = t.priority ? t.priority.priority : 'none';
          const assigneeList = (t.assignees || []);
          const a = assigneeList.length > 0 ? 'assigned' : 'NONE';
          const due = t.due_date ? new Date(parseInt(t.due_date)).toISOString().split('T')[0] : 'NO-DUE';
          const start = t.start_date ? new Date(parseInt(t.start_date)).toISOString().split('T')[0] : 'no-start';
          const chk = (t.checklists || []).length;
          allTasks.push([label, t.id, t.name, p, a, start + ' > ' + due, 'chk:' + chk].join(' | '));
        });
      } catch(e) { console.error('Parse error for ' + label); }
      completed++;
      if (completed === lists.length) {
        allTasks.sort();
        allTasks.forEach(l => console.log(l));
        console.log('\n=== SUMMARY ===');
        console.log('Total tasks: ' + allTasks.length);
        const withDue = allTasks.filter(l => l.indexOf('NO-DUE') === -1).length;
        const withAssignee = allTasks.filter(l => l.indexOf('| NONE |') === -1).length;
        const withChecklist = allTasks.filter(l => l.indexOf('chk:0') === -1).length;
        console.log('With due dates: ' + withDue + '/' + allTasks.length);
        console.log('With assignees: ' + withAssignee + '/' + allTasks.length);
        console.log('With checklists: ' + withChecklist + '/' + allTasks.length);
      }
    });
  });
  req.on('error', (e) => { console.error('Error: ' + e.message); completed++; });
});
