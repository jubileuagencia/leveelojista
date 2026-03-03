import { BubbleService } from './bubbleService.js';

// Initialize the BubbleService
const bubbleService = new BubbleService();

async function run() {
  try {
    // Fetch the schema
    const schema = await bubbleService.getSchema();
    console.log('Schema:', schema);

    // Example: List some data types
    const organizations = await bubbleService.list('custom.organization');
    console.log('Organizations:', organizations);

    const branches = await bubbleService.list('custom.branch');
    console.log('Branches:', branches);

  } catch (error) {
    console.error('Error running MCP client:', error);
  }
}

run();
