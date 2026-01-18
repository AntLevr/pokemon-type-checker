const TYPES = [
  "一般","格斗","飞行","毒","地面","岩石","虫","幽灵","钢",
  "火","水","草","电","超能","冰","龙","恶","妖精"
];

/* 攻击关系表（100% 来自你上传的图） */
const ATK = {
  一般:{岩石:0.5,钢:0.5,幽灵:0},
  格斗:{一般:2,岩石:2,钢:2,冰:2,恶:2,毒:0.5,飞行:0.5,超能:0.5,虫:0.5,妖精:0},
  飞行:{格斗:2,虫:2,草:2,岩石:0.5,钢:0.5,电:0.5},
  毒:{草:2,妖精:2,毒:0.5,地面:0.5,岩石:0.5,幽灵:0.5,钢:0},
  地面:{毒:2,岩石:2,钢:2,火:2,电:2,虫:0.5,草:0.5,飞行:0},
  岩石:{飞行:2,虫:2,火:2,冰:2,格斗:0.5,地面:0.5,钢:0.5},
  虫:{草:2,超能:2,恶:2,格斗:0.5,飞行:0.5,毒:0.5,幽灵:0.5,钢:0.5,妖精:0.5},
  幽灵:{幽灵:2,超能:2,恶:0.5,一般:0},
  钢:{岩石:2,冰:2,妖精:2,钢:0.5,火:0.5,水:0.5,电:0.5},
  火:{虫:2,钢:2,草:2,冰:2,岩石:0.5,火:0.5,水:0.5,龙:0.5},
  水:{地面:2,岩石:2,火:2,水:0.5,草:0.5,龙:0.5},
  草:{地面:2,岩石:2,水:2,飞行:0.5,毒:0.5,虫:0.5,钢:0.5,火:0.5,草:0.5,龙:0.5},
  电:{飞行:2,水:2,草:0.5,电:0.5,龙:0.5,地面:0},
  超能:{格斗:2,毒:2,钢:0.5,超能:0.5,恶:0},
  冰:{飞行:2,地面:2,草:2,龙:2,钢:0.5,火:0.5,水:0.5,冰:0.5},
  龙:{龙:2,钢:0.5,妖精:0},
  恶:{幽灵:2,超能:2,格斗:0.5,恶:0.5,妖精:0.5},
  妖精:{格斗:2,龙:2,恶:2,火:0.5,毒:0.5,钢:0.5}
};

const selected = new Set();
const btnBox = document.getElementById("buttons");
const atkBox = document.getElementById("attack");
const defBox = document.getElementById("defense");

/* 生成按钮 */
TYPES.forEach(t => {
  const b = document.createElement("button");
  b.textContent = t;
  b.onclick = () => {
    b.classList.toggle("active");
    b.classList.contains("active") ? selected.add(t) : selected.delete(t);
    update();
  };
  btnBox.appendChild(b);
});

function update() {
  atkBox.innerHTML = "";
  defBox.innerHTML = "";

  if (selected.size === 0) return;

  /* ===== 攻击方：对所有属性的倍率 ===== */
  TYPES.forEach(defType => {
    let mult = -1;
    selected.forEach(atkType => {
      const row = ATK[atkType];
      if (row && row[defType] != null) {
        mult = Math.max(mult, row[defType]); // 并集
      }
    });
    if (mult === -1) mult = 1;
    add(atkBox, defType, mult);
  });

  /* ===== 防御方：受到所有属性攻击的倍率 ===== */
  TYPES.forEach(enemyAtk => {
    let mult = 1;
    selected.forEach(myType => {
      const row = ATK[enemyAtk];
      if (row && row[myType] != null) {
        mult *= row[myType]; // 真实倍率（相乘）
      }
    });
    add(defBox, enemyAtk, mult);
  });
}

function add(dom, type, mult) {
  const s = document.createElement("span");
  s.textContent = `${type} ×${mult}`;
  dom.appendChild(s);
}
