const { execSync } = require("child_process");
if(!process.argv[2]){
  console.error('');
  return
}
const command = `webpack serve --mode=development --env pages=${process.argv[2]}`;
execSync(command, { stdio: "inherit" });
