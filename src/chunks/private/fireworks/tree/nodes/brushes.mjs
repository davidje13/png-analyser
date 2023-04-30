import { getBasicValue, registerNode } from '../node_registry.mjs';

registerNode('BPL', 'v', { // Brush ???
  read: (target, value) => {
    const category = getBasicValue(value, 'CAT', 's');
    const name = getBasicValue(value, 'INM', 's');
    const RDO = getBasicValue(value, 'RDO', 'b');
    const BAN = getBasicValue(value, 'BAN', 'i');
    const BAS = getBasicValue(value, 'BAS', 'i');
    const diameter = getBasicValue(value, 'BDI', 'i');
    const BMM = getBasicValue(value, 'BMM', 'i');
    const BMS = getBasicValue(value, 'BMS', 'i');
    const BSE = getBasicValue(value, 'BSE', 'i'); // 0 = "hard", 500 = "soft", 1000 = "air brush"
    const BSF = getBasicValue(value, 'BSF', 'i');
    const BSH = getBasicValue(value, 'BSH', 'i'); // 1 = "rounded"
    const BBL = getBasicValue(value, 'BBL', 'i');
    const BBK = getBasicValue(value, 'BBK', 'i');
    const BCN = getBasicValue(value, 'BCN', 'i');
    const BEF = getBasicValue(value, 'BEF', 'i');
    const BRT = getBasicValue(value, 'BRT', 'i');
    const BFB = getBasicValue(value, 'BFB', 'i');
    const BFR = getBasicValue(value, 'BFR', 'i');
    const BNT = getBasicValue(value, 'BNT', 'i');
    const BSP = getBasicValue(value, 'BSP', 'i');
    const BTB = getBasicValue(value, 'BTB', 'i');
    const BTE = getBasicValue(value, 'BTE', 'i');
    const BTS = getBasicValue(value, 'BTS', 'i');
    const BSM = getBasicValue(value, 'BSM', 'i');
    const BCM = getBasicValue(value, 'BCM', 'i');
    const BIA = getBasicValue(value, 'BIA', 'b');
    const NDI = getBasicValue(value, 'NDI', 'i');
    const DO1 = getBasicValue(value, 'DO1', 'i');
    const DO2 = getBasicValue(value, 'DO2', 'i');
    const DO3 = getBasicValue(value, 'DO3', 'i');
    const DF1 = getBasicValue(value, 'DF1', 'i');
    const DF2 = getBasicValue(value, 'DF2', 'i');
    const DF3 = getBasicValue(value, 'DF3', 'i');

    target.diameter = diameter ?? 1;

    target.toString = () => [
      `${JSON.stringify(category)} / ${JSON.stringify(name)}`
    ].join('');

    target.display = (summary, content) => {
      summary.append(`Brush: ${JSON.stringify(category)} / ${JSON.stringify(name)}`);
      content.append([
        `RDO: ${RDO}`,
        `BAN: ${BAN}`,
        `BAS: ${BAS}`,
        `diameter: ${diameter}`,
        `BMM: ${BMM}`,
        `BMS: ${BMS}`,
        `BSE: ${BSE}`,
        `BSF: ${BSF}`,
        `BSH: ${BSH}`,
        `BBL: ${BBL}`,
        `BBK: ${BBK}`,
        `BCN: ${BCN}`,
        `BEF: ${BEF}`,
        `BRT: ${BRT}`,
        `BFB: ${BFB}`,
        `BFR: ${BFR}`,
        `BNT: ${BNT}`,
        `BSP: ${BSP}`,
        `BTB: ${BTB}`,
        `BTE: ${BTE}`,
        `BTS: ${BTS}`,
        `BSM: ${BSM}`,
        `BCM: ${BCM}`,
        `BIA: ${BIA}`,
        `NDI: ${NDI}`,
        `DO1: ${DO1}`,
        `DO2: ${DO2}`,
        `DO3: ${DO3}`,
        `DF1: ${DF1}`,
        `DF2: ${DF2}`,
        `DF3: ${DF3}`,
      ].join(', '));
    };
  },
});
