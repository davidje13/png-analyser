import { getBasicValue, registerNode } from '../node_registry.mjs';

const FEEDBACK = ['none', 'brush', 'background'];

registerNode('BPL', 'v', { // Brush ???
  read: (target, value) => {
    const category = getBasicValue(value, 'CAT', 's');
    const name = getBasicValue(value, 'INM', 's');
    const friendlyName = getBasicValue(value, 'UNM', 's');
    const RDO = getBasicValue(value, 'RDO', 'b');
    const angle = getBasicValue(value, 'BAN', 'i');
    const aspect = getBasicValue(value, 'BAS', 'i');
    const diameter = getBasicValue(value, 'BDI', 'i');
    const BMM = getBasicValue(value, 'BMM', 'i');
    const BMS = getBasicValue(value, 'BMS', 'i');
    const softness = (getBasicValue(value, 'BSE', 'i') ?? 0) * 0.1;
    const BSF = getBasicValue(value, 'BSF', 'i');
    const BSH = getBasicValue(value, 'BSH', 'i'); // 1 = "rounded"
    const BBL = getBasicValue(value, 'BBL', 'i');
    const BBK = getBasicValue(value, 'BBK', 'i');
    const concentration = getBasicValue(value, 'BCN', 'i');
    const BEF = getBasicValue(value, 'BEF', 'i');
    const BRT = getBasicValue(value, 'BRT', 'i');
    const feedback = getBasicValue(value, 'BFB', 'i');
    const flowRate = getBasicValue(value, 'BFR', 'i');
    const tipCount = getBasicValue(value, 'BNT', 'i');
    const BSP = getBasicValue(value, 'BSP', 'i');
    const BTB = getBasicValue(value, 'BTB', 'i');
    const BTE = getBasicValue(value, 'BTE', 'i');
    const BTS = getBasicValue(value, 'BTS', 'i');
    const BSM = getBasicValue(value, 'BSM', 'i');
    const BCM = getBasicValue(value, 'BCM', 'i');
    const SPH = getBasicValue(value, 'SPH', 'i');
    const SPZ = getBasicValue(value, 'SPZ', 'i');
    const SPO = getBasicValue(value, 'SPO', 'i');
    const SPB = getBasicValue(value, 'SPB', 'i');
    const SPR = getBasicValue(value, 'SPR', 'i');
    const SSH = getBasicValue(value, 'SSH', 'i');
    const SSZ = getBasicValue(value, 'SSZ', 'i');
    const SSO = getBasicValue(value, 'SSO', 'i');
    const SSB = getBasicValue(value, 'SSB', 'i');
    const SSR = getBasicValue(value, 'SSR', 'i');
    const SRA = getBasicValue(value, 'SRA', 'i');
    const SRS = getBasicValue(value, 'SRS', 'i');
    const SRB = getBasicValue(value, 'SRB', 'i');
    const SRR = getBasicValue(value, 'SRR', 'i');
    const SRH = getBasicValue(value, 'SRH', 'i');
    const SRZ = getBasicValue(value, 'SRZ', 'i');
    const SRO = getBasicValue(value, 'SRO', 'i');
    const isAntialiased = getBasicValue(value, 'BIA', 'b');
    const dashCount = getBasicValue(value, 'NDI', 'i') ?? 0;
    const dashOn1 = getBasicValue(value, 'DO1', 'i');
    const dashOn2 = getBasicValue(value, 'DO2', 'i');
    const dashOn3 = getBasicValue(value, 'DO3', 'i');
    const dashOff1 = getBasicValue(value, 'DF1', 'i');
    const dashOff2 = getBasicValue(value, 'DF2', 'i');
    const dashOff3 = getBasicValue(value, 'DF3', 'i');

    target.diameter = diameter ?? 1;

    target.toString = () => [
      `${JSON.stringify(category)} / ${JSON.stringify(name)} ${JSON.stringify(friendlyName)}`
    ].join('');

    const dash = [dashOn1, dashOff1, dashOn2, dashOff2, dashOn3, dashOff3].slice(0, dashCount * 2);

    target.display = (summary, content) => {
      summary.append(`Brush: ${JSON.stringify(category)} / ${JSON.stringify(name)} ${JSON.stringify(friendlyName)}`);
      content.append([
        `RDO: ${RDO}`,
        `angle: ${angle}`,
        `aspect: ${aspect}`,
        `diameter: ${diameter}`,
        `BMM: ${BMM}`,
        `BMS: ${BMS}`,
        `softness: ${softness}`,
        `BSF: ${BSF}`,
        `BSH: ${BSH}`,
        `BBL: ${BBL}`,
        `BBK: ${BBK}`,
        `concentration: ${concentration}`,
        `BEF: ${BEF}`,
        `BRT: ${BRT}`,
        `feedback: ${FEEDBACK[feedback ?? -1] ?? '?'}`,
        `flowRate: ${flowRate}`,
        `tipCount: ${tipCount}`,
        `BSP: ${BSP}`,
        `BTB: ${BTB}`,
        `BTE: ${BTE}`,
        `BTS: ${BTS}`,
        `BSM: ${BSM}`,
        `BCM: ${BCM}`,
        `SPH: ${SPH}`,
        `SPZ: ${SPZ}`,
        `SPO: ${SPO}`,
        `SPB: ${SPB}`,
        `SPR: ${SPR}`,
        `SSH: ${SSH}`,
        `SSZ: ${SSZ}`,
        `SSO: ${SSO}`,
        `SSB: ${SSB}`,
        `SSR: ${SSR}`,
        `SRA: ${SRA}`,
        `SRS: ${SRS}`,
        `SRB: ${SRB}`,
        `SRR: ${SRR}`,
        `SRH: ${SRH}`,
        `SRZ: ${SRZ}`,
        `SRO: ${SRO}`,
        `antialiased: ${isAntialiased}`,
        `dash: ${dash.join(' ') || 'none'}`,
      ].join(', '));
    };
  },
});
