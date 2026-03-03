@echo off
echo ========================================
echo  LEVEE HORTIPLUS - ANALISE DEMOGRAFICA
echo ========================================
echo.
echo Executando analise dos dados...
echo.

node analise-demografica.cjs

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  ANALISE CONCLUIDA COM SUCESSO!
    echo ========================================
    echo.
    echo Arquivos gerados:
    echo  - analise-demografica-resultado.json
    echo.
    echo Para visualizar o relatorio:
    echo  1. Abra o arquivo: relatorio-demografico.html
    echo  2. Use qualquer navegador
    echo.
    echo Pressione qualquer tecla para abrir o relatorio...
    pause > nul
    start relatorio-demografico.html
) else (
    echo.
    echo ========================================
    echo  ERRO NA EXECUCAO DA ANALISE
    echo ========================================
    echo.
    echo Verifique se:
    echo  1. Node.js esta instalado
    echo  2. Os arquivos JSON estao na pasta banco de dados/
    echo.
    pause
)
