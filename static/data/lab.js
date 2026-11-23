// Data transcribed from the Nov 2026 manuscript.
// VERBS: Table S1 -> [verb, ground-truth count, VLM-predicted count]
// PAIRS: Figure 3 heatmap (non-zero cells only) -> [action, object, VLM count]
// TASKS: task descriptions from Table 1. Teleop and evaluation numbers come from
// static/data/robot.js (generated from the raw exports by scripts/build_robot_data.py).

window.LAB_DATA = {
  VERBS: [
    ["pick",2032,4477],["place",1770,3463],["open",533,1500],["close",429,1202],["dispense",248,905],
    ["turn on",289,808],["turn off",80,289],["press",236,249],["insert",46,261],["wipe",14,215],
    ["scoop",35,196],["cut",64,104],["adjust",2,82],["turn",14,83],["scribe",0,47],["write",12,58],
    ["tare",44,117],["fold",18,69],["label",33,46],["remove",16,47],["cleave",0,20],["clean",31,36],
    ["scrape",6,44],["peel",17,34],["stir",0,39],["put on",2,16],["set",6,13],["pull",4,16],["wrap",1,22],
    ["tear",0,12],["hold",2,7],["pour",5,32],["swirl",8,13],["fill",0,6],["shake",16,26],["use",0,8],
    ["mix",5,22],["break",2,6],["blow",0,6],["set volume",0,7],["flip",6,8],["dip",0,9],["apply",1,9],
    ["grind",1,16],["knead",5,4],["strike",1,4],["loosen",0,8],["score",73,6],["manipulate",0,10],
    ["rinse",0,3],["unfold",12,7],["spray",0,10],["push",7,5],["lower",4,5],["eject",3,4],["release",11,8],
    ["tighten",2,5],["dispose",0,3],["compact",0,2],["sew",0,2],["discard",3,4],["smooth",0,4],
    ["aspirate",0,3],["squeeze",10,5],["vortex",0,13],["walk",0,2],["lift",4,2],["unwrap",1,4],
    ["select",0,2],["withdraw",0,5],["agitate",0,2],["shape",0,2],["tap",10,6],["separate",1,2],
    ["tamp",1,1],["confirm",0,1],["navigate",0,1],["search",0,1],["set timer",0,1],["wind",0,1],
    ["trim",0,10],["clamp",0,2],["apply heat",0,4],["spread",0,2],["crimp",0,2],["walk to",0,2],
    ["read",1,1],["align",0,1],["blot",0,1],["flex",0,1],["repeat",0,1],["square",0,1],["type",0,1],
    ["put",0,1],["swivel",0,1],["unroll",0,1],["roll",2,2],["snap",3,3],["record",1,2],["flatten",0,1],
    ["submerge",0,1],["unscrew",0,1],["compress",0,2],["latch",0,1],["scrub",0,1],["tear off",0,1],
    ["turn over",0,1],["throw away",5,1],["rip",26,0],["rotate",9,0],["tip",7,0],["wipe down",7,0],
    ["orient",5,0],["point",4,0],["pull out",4,0],["transfer",4,0],["connect",3,0],["move razor",3,0],
    ["click",2,0],["hook",2,0],["move around",2,0],["pinch",2,0],["stretch",2,0],["touch",2,0],
    ["apply pressure",1,0],["check volume",1,0],["choose",1,0],["crumple",1,0],["drag",1,0],["draw",1,0],
    ["enter text",1,0],["lock",1,0],["move vertically",1,0],["oscillate",1,0],["print",1,0],["pull up",1,0],
    ["purge",1,0],["push down",1,0],["scratch",1,0],["stick",1,0],["suction",1,0],["support",1,0],
    ["throw",1,0],["tilt",1,0],["tip over",1,0],["translate",1,0],["wash",1,0]
  ],

  PAIRS: [
    ["pick","vial",107],["place","vial",111],["open","vial",92],["close","vial",88],
    ["pick","beaker",120],["place","beaker",120],["open","beaker",2],["close","beaker",2],
    ["pick","substrate",172],["place","substrate",185],
    ["dispense","powder",50],["pick","powder",161],["place","powder",206],["scoop","powder",133],
    ["pick","spatula",208],["place","spatula",42],["press","spatula",4],
    ["pick","tweezers",224],["place","tweezers",40],["press","tweezers",2],
    ["pick","wafer",227],["place","wafer",165],["score","wafer",1],
    ["pick","pipette",248],["place","pipette",130],["open","pipette",58],["turn on","pipette",32],["close","pipette",55],
    ["dispense","sample",8],["pick","sample",369],["place","sample",357],["scoop","sample",14],
    ["dispense","liquid",410],["pick","liquid",13],["place","liquid",3],["scoop","liquid",2]
  ],

  // video: supplementary robot videos that exist today.
  TASKS: [
    {id:"dispense-liquid", name:"Dispense liquid", verb:"dispense", object:"liquid",
     desc:"Holding a vial of liquid, align and pour it into a fixed cup.", success:"The water is poured into the receiving cup.", video:{success:"S3/S4", failure:"S3/S4"}},
    {id:"pick-pipette", name:"Pick pipette", verb:"pick", object:"pipette",
     desc:"Grasp a pipette standing in a cup and lift it out.", success:"Pipette fully out of the cup and held.", video:null},
    {id:"pick-wafer", name:"Pick wafer", verb:"pick", object:"wafer",
     desc:"With tweezers in one arm, lift a wafer lying flat in a container.", success:"Wafer lifted out of the container and held.", video:null},
    {id:"pick-tweezers", name:"Pick tweezers", verb:"pick", object:"tweezers",
     desc:"Grasp a pair of tweezers from the table and lift them.", success:"Tweezers off the table and held.", video:null},
    {id:"pick-spatula", name:"Pick spatula", verb:"pick", object:"spatula",
     desc:"Grasp a spatula from the table and lift it.", success:"Spatula off the table and held.", video:null},
    {id:"place-powder", name:"Place powder", verb:"place", object:"powder",
     desc:"With sand on a spatula, pour it onto weighing paper on a scale.", success:"More than 80% of the sand on the paper.", video:null},
    {id:"place-wafer", name:"Place wafer", verb:"place", object:"wafer",
     desc:"With tweezers holding a wafer, place it into a container.", success:"Wafer rests in the container, arm clear.", video:null},
    {id:"pick-powder-bottle", name:"Pick powder bottle", verb:"pick", object:"powder",
     desc:"Grasp a powder bottle and lift it.", success:"Bottle off the table and held.", video:null},
    {id:"scoop-powder", name:"Scoop powder", verb:"scoop", object:"powder",
     desc:"Insert a held spatula into a powder bottle and scoop.", success:"Spatula withdrawn carrying powder.", video:{success:"S5/S6", failure:"S5/S6"}},
    {id:"place-pipette", name:"Place pipette", verb:"place", object:"pipette",
     desc:"Lower a held pipette into a fixed cup and release it.", success:"Pipette stands in the cup, arm clear.", video:{success:"S1/S2", failure:"S1/S2"}}
  ],

  APPROACHES: ["π0.5 all-tasks", "π0.5 single-task", "GPT-6.1 Sol", "Dream-1"]
};
