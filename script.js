const TYPES = [
  "一般","火","水","草","电","冰","格斗","毒","地面",
  "飞行","超能","虫","岩石","幽灵","龙","恶","钢","妖精"
];

const chart = {
  一般:{atk:{},def:{格斗:2,幽灵:0}},
  火:{atk:{草:2,冰:2,虫:2,钢:2},def:{水:2,地面:2,岩石:2,火:0.5,草:0.5}},
  水:{atk:{火:2,地面:2,岩石:2},def:{电:2,草:2,火:0.5,水:0.5}},
  草:{atk:{水:2,地面:2,岩石:2},def:{火:2,冰:2,毒:2,飞行:2,虫:2,水:0.5,电:0.5}},
  电:{atk:{水:2,飞行:2},def:{地面:2,电:0.5,飞行:0.5}},
  冰:{atk:{草:2,地面:2,飞行:2,龙:2},def:{火:2,格斗:2,岩石:2,钢:2}},
  格斗:{atk:{一般:2,冰:2,岩石:2,恶:2,钢:2},def:{飞行:2,超能:2,妖精:2}},
  毒:{atk:{草:2,妖精:2},def:{地面:2,超能:2,草:0.5}},
  地面:{atk:{火:2,电:2,毒:2,岩石:2,钢:2},def:{水:2,草:2,冰:2,电:0}},
  飞行:{atk:{草:2,格斗:2,虫:2},def:{电:2,冰:2,岩石:2,地面:0}},
  超能:{atk:{格斗:2,毒:2},def:{虫:2,幽灵:2,恶:2}},
  虫:{atk:{草:2,超能:2,恶:2},def:{火:2,飞行:2,岩石:2}},
  岩石:{atk:{火:2,冰:2,飞行:2,虫:2},def:{水:2,草:2,格斗:2,地面:2}},
  幽灵:{atk:{超能:2,幽灵:2},def:{幽灵:2,恶:2,一般:0,格斗:0}},
  龙:{atk:{龙:2},def:{冰:2,龙:2,妖精:0}},
  恶:{atk:{超能:2,幽灵:2},def:{格斗:2,虫:2,妖精:2}},
  钢:{atk:{冰:2,岩石:2,妖精:2},def:{火:2,格斗:2,地面:2,毒:0}},
  妖精:{atk:{格斗:2,龙:2,恶:2},def:{毒:2,钢:2,龙:0}}
};

const selected = new Set();

const btnDiv = document.getElementById("buttons");
const atkDiv = document.getElementById("attack");
const defDiv = document.getElementById("defense");

/* 生成按钮 */
TYPES.forEach(t=>{
  const b=document.createElement("button");
  b.textContent=t;
  b.onclick=()=>{
    b.classList.toggle("active");
    b.classList.contains("active") ? selected.add(t) : selected.delete(t);
    update();
  };
  btnDiv.appendChild(b);
});

function update(){
  atkDiv.innerHTML="";
  defDiv.innerHTML="";

  if(selected.size===0) return;

  /* ===== 攻击：并集 ===== */
  const atkMap={};
  selected.forEach(t=>{
    const atk=chart[t].atk;
    for(const k in atk){
      atkMap[k]=Math.max(atkMap[k]||1,atk[k]);
    }
  });
  render(atkMap,atkDiv);

  /* ===== 防御：真实倍率 ===== */
  const defMap={};
  TYPES.forEach(enemy=>{
    let m=1;
    selected.forEach(me=>{
      if(chart[me].def[enemy]!=null){
        m*=chart[me].def[enemy];
      }
    });
    if(m!==1) defMap[enemy]=m;
  });
  render(defMap,defDiv);
}

function render(map,dom){
  Object.entries(map)
    .sort((a,b)=>b[1]-a[1])
    .forEach(([t,m])=>{
      const s=document.createElement("span");
      s.textContent=`${t} ×${m}`;
      dom.appendChild(s);
    });
}
