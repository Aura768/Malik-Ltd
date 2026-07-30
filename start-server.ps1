Set-Location -Path 'D:\Vibe Coder'
$logFile = 'D:\Vibe Coder\bota-server.log'
npx tsx server.ts *>&1 | ForEach-Object { $_ } | Add-Content -LiteralPath $logFile -Encoding utf8
