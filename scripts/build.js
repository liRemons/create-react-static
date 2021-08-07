const { execSync } = require("child_process");
if(!process.argv[2]){
  console.error('');
  return
}
const command = `webpack --mode=production --env pages=${process.argv[2]}`;
execSync(command, { stdio: "inherit" });
