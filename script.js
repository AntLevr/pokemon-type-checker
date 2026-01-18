const typeChart = {
  一般: { 攻击: {}, 防御: { 格斗: 2, 幽灵: 0 } },
  火: { 攻击: { 草: 2, 冰: 2, 虫: 2, 钢: 2 }, 防御: { 水: 2, 地面: 2, 岩石: 2, 火: 0.5, 草: 0.5 } },
  水: { 攻击: { 火: 2, 地面: 2, 岩石: 2 }, 防御: { 电: 2, 草: 2, 火: 0.5, 水: 0.5 } },
  草: { 攻击: { 水: 2, 地面: 2, 岩石: 2 }, 防御: { 火: 2, 冰: 2, 毒: 2, 飞行: 2, 虫: 2, 水: 0.5, 电: 0.5 } },
  电: { 攻击: { 水: 2, 飞行: 2 }, 防御: { 地面: 2, 电: 0.5, 飞行: 0.5 } },
  冰: { 攻击: { 草: 2, 地面: 2, 飞行: 2, 龙: 2 }, 防御: { 火: 2, 格斗: 2, 岩石: 2, 钢: 2 } },
  格斗: { 攻击: { 一般: 2, 冰: 2, 岩石: 2, 恶: 2, 钢: 2 }, 防御: { 飞行: 2, 超能: 2, 妖精: 2 } },
  毒: { 攻击: { 草: 2, 妖精: 2 }, 防御: { 地面: 2, 超能: 2, 草: 0.5 } },
  地面: { 攻击: { 火: 2, 电: 2, 毒: 2, 岩石: 2, 钢: 2 }, 防御: { 水: 2, 草: 2, 冰: 2, 电: 0 } },
  飞行: { 攻击: { 草: 2, 格斗: 2, 虫: 2 }, 防御: { 电: 2, 冰: 2, 岩石: 2, 地面: 0 } },
  超能: { 攻击: { 格斗: 2, 毒: 2 }, 防御: { 虫: 2, 幽灵: 2, 恶: 2 } },
  虫: { 攻击: { 草: 2, 超能: 2, 恶: 2 }, 防御: { 火: 2, 飞行: 2, 岩石: 2 } },
  岩石: { 攻击: { 火: 2, 冰: 2, 飞行: 2, 虫: 2 }, 防御: { 水: 2, 草: 2, 格斗: 2, 地面: 2 } },
  幽灵: { 攻击: { 超能: 2, 幽灵: 2 }, 防御: { 幽灵: 2, 恶: 2, 一般: 0, 格斗: 0 } },
  龙: { 攻击: { 龙: 2 }, 防御: { 冰: 2, 龙: 2, 妖精: 0 } },
  恶: { 攻击: { 超能: 2, 幽灵: 2 }, 防御: { 格斗: 2, 虫: 2, 妖精: 2 } },
  钢: { 攻击: { 冰: 2, 岩石: 2, 妖精: 2 }, 防御: { 火: 2, 格斗: 2, 地面: 2, 毒: 0 } },
  妖精: { 攻击: { 格斗: 2, 龙: 2, 恶: 2 }, 防御: { 毒: 2, 钢: 2, 龙: 0 } }
};

const buttonsDiv = document.getElementById("typeButtons");
const attackDiv = document.getElementById("attackResult");
const defenseDiv = document.getElementById("defenseResult");

let selectedTypes = [];

Object.keys(typeChart).forEach(type => {
  const btn = document.createElement("button");
  btn.textContent = type;
  btn.onclick = () => toggleType(type, btn);
  buttonsDiv.appendChild(btn);
});

function toggleType(type, btn) {
  if (selectedTypes.includes(type)) {
    selectedTypes = selectedTypes.filter(t => t !== type);
    btn.classList.remove("active");
  } else {
    selectedTypes.push(type);
    btn.classList.add("active");
  }
  updateResults();
}

function updateResults() {
  attackDiv.innerHTML = "";
  defenseDiv.innerHTML = "";

  // 攻击：取最大倍率（并集）
  const attackMap = {};

  selectedTypes.forEach(type => {
    const atk = typeChart[type].攻击;
    for (let t in atk) {
      attackMap[t] = Math.max(attackMap[t] || 1, atk[t]);
    }
  });

  render(attackMap, attackDiv);

  // 防御：真实倍率（相乘）
  const defenseMap = {};

  Object.keys(typeChart).forEach(enemyType => {
    let multiplier = 1;

    selectedTypes.forEach(myType => {
      const def = typeChart[myType].防御;
      if (def[enemyType] !== undefined) {
        multiplier *= def[enemyType];
      }
    });

    if (multiplier !== 1) {
      defenseMap[enemyType] = multiplier;
    }
  });

  render(defenseMap, defenseDiv);
}

function render(map, container) {
  Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, mult]) => {
      const span = document.createElement("span");
      span.textContent = `${type} ×${mult}`;
      container.appendChild(span);
    });
}
