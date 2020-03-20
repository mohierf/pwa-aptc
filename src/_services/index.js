export * from "./answer.service";
export * from "./dailyMessage.service";
export * from "./freeActivity.service";
export * from "./machine.service";
export * from "./media.service";
export * from "./patient.service";
export * from "./phe.service";
export * from "./user.service";
export * from "./value.service";
export * from "./valueAnswer.service";

// /*
//     I found it handy to reduce the amount of requires in a complex
//     project by grouping small modules together like below.
//     If you put this code into "index.js" then it'll pick up any other
//     JS modules in that directory and expose them as sub-modules.
//
//     - Any exports in *this* module would be myPackage.exportName
//     - Any exports in other modules would be myPackage.moduleName.exportName
// */
//
// const fs = require("fs");
//
// // Read in the libs from this directory and add them as exports
// // This way you can just reference
// fs.readdirSync(".").forEach(function(file) {
//   if (file.indexOf(".js") > -1 && file != "index.js")
//     exports[file.replace(".js", "")] = require("./" + file);
// });
