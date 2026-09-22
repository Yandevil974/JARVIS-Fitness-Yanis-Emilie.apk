import React from "react";
import { norm } from "../engine/utils.js";

export function resolveAnimationType({ exercise, movementName, pattern, muscle }) {
  const name = norm(movementName || exercise?.name || "");
  const pat = norm(pattern || exercise?.pattern || "");
  const exName = norm(exercise?.name || "");

  // Pool specific - check movementName first (highest priority for pool)
  // Direct pattern handling for warmup and pool
  if (pat === "aquaWalk" || pat === "aquawalk") return "aquaWalk";
  if (pat === "aquaRest" || pat === "aquarest") return "aquaRest";
  if (pat === "aquaJog" || pat === "aquajog") return "aquaJog";
  if (pat === "kneeRaise" || pat === "kneeraise") return "kneeRaise";
  if (pat === "scissor") return "scissor";
  if (pat === "lateral") return "lateral";
  if (pat === "buttKick" || pat === "buttkick") return "buttKick";
  if (pat === "poolPushup" || pat === "poolpushup") return "poolPushup";
  if (pat === "plankVertical" || pat === "plankvertical") return "plankVertical";
  if (pat === "flutterKick" || pat === "flutterkick") return "flutterKick";
  if (pat === "staticSwim" || pat === "staticswim") return "staticSwim";
  if (pat === "gentleSwim" || pat === "gentleswim") return "gentleSwim";
  if (pat === "swimSprint" || pat === "swimsprint") return "swimSprint";
  if (pat === "stretchPool" || pat === "stretchpool") return "stretchPool";
  if (pat === "shoulderMobility" || pat === "shouldermobility") return "shoulderMobility";
  if (pat === "hipMobility" || pat === "hipmobility") return "hipMobility";
  if (pat === "hipmobility" || pat === "shouldermobility") return pat;

  if (name.includes("aqua jogging") || name.includes("aqua-jogging")) return "aquaJog";
  if (name.includes("montee") && name.includes("genou")) return "kneeRaise";
  if (name.includes("ciseaux")) return "scissor";
  if ((name.includes("deplacement") || name.includes("deplacements")) && (name.includes("lateral") || name.includes("lateraux") || name.includes("later")) ) return "lateral";
  if (name.includes("talon") && name.includes("fesse")) return "buttKick";
  if (name.includes("pompe") && name.includes("bord")) return "poolPushup";
  if (name.includes("gainage") && (name.includes("bord") || name.includes("vertical"))) return "plankVertical";
  if (name.includes("battement")) return "flutterKick";
  if (name.includes("marche aquatique")) return "aquaWalk";
  if (name.includes("nage statique")) return "staticSwim";
  if (name.includes("nage douce")) return "gentleSwim";
  if (name.includes("fractionne") || name.includes("sprint") || (name.includes("nager") && !name.includes("douce"))) {
    if (name.includes("sprint") || name.includes("fond") || name.includes("fractionne")) return "swimSprint";
    return "swim";
  }
  if (name.includes("recup") || name.includes("souffler") || name.includes("retour au calme") || name.includes("respiration")) {
    // Distinguish water vs land recovery by context
    if (name.includes("aquatique") || name.includes("bord") || pat.includes("swim") || exName.includes("piscine") || (movementName||"").toLowerCase().includes("marche")) {
      return "aquaRest";
    }
    return "breathe";
  }
  if (name.includes("etirement") && name.includes("bord")) return "stretchPool";
  if (name.includes("mobilite") && name.includes("epaule")) return "shoulderMobility";
  if (name.includes("mobilite") && (name.includes("hanche") || name.includes("cheville"))) return "hipMobility";
  if (name.includes("etirement") || pat.includes("stretch")) {
    // Specific stretch by muscle
    if (muscle === "pec" || name.includes("porte") || name.includes("poitrine")) return "stretchPec";
    if (muscle === "dos" || name.includes("enfant") || name.includes("suspension")) return "stretchBack";
    if (muscle === "qua" || name.includes("talon") && name.includes("fesse") && !name.includes("jog")) return "stretchQuad";
    if (muscle === "isc" || name.includes("ischio")) return "stretchHamstring";
    if (muscle === "fes" || name.includes("pigeon") || name.includes("piriforme")) return "stretchGlute";
    if (muscle === "mol" || name.includes("mollet")) return "stretchCalf";
    return "stretch";
  }

  // Gym patterns
  if (pat.includes("squat") || exName.includes("squat") || exName.includes("presse a cuisse") || exName.includes("leg press")) return "squat";
  if (pat.includes("lunge") || exName.includes("fente") || exName.includes("lunge") || exName.includes("split squat") || exName.includes("step up") || exName.includes("bulgarian")) return "lunge";
  if (pat.includes("hinge") || exName.includes("souleve") || exName.includes("roumain") || exName.includes("good morning") || exName.includes("back extension")) return "hinge";
  if (pat.includes("bridge") || exName.includes("hip thrust") || exName.includes("pont fessier") || exName.includes("glute bridge")) return "bridge";
  if (pat.includes("abduction") || exName.includes("abduction") || exName.includes("clamshell") || exName.includes("fire hydrant")) return "abduction";
  if (pat.includes("legcurl") || exName.includes("leg curl")) return "legCurl";
  if (pat.includes("legext") || exName.includes("leg extension")) return "legExtension";
  if (pat.includes("calf") || exName.includes("mollet")) return "calfRaise";
  if (pat.includes("press") || exName.includes("developpe") || exName.includes("pompe") || exName.includes("dips")) {
    if (exName.includes("couche") || exName.includes("incline") || exName.includes("decline") || exName.includes("pompe")) return "benchPress";
    return "overheadPress";
  }
  if (pat.includes("row") || exName.includes("rowing") || exName.includes("tirage horizontal")) return "row";
  if (pat.includes("pull") || exName.includes("traction") || exName.includes("tirage vertical") || exName.includes("pullover")) return "pullup";
  if (pat.includes("curl") || exName.includes("curl") || exName.includes("biceps")) return "bicepCurl";
  if (pat.includes("triceps") || exName.includes("triceps") || exName.includes("extension") && exName.includes("triceps") || exName.includes("barre au front") || exName.includes("pushdown")) return "tricepsExtension";
  if (pat.includes("lat") || exName.includes("elevation laterale") || exName.includes("ecarte")) return "lateralRaise";
  if (pat.includes("raise") || exName.includes("elevation") && !exName.includes("laterale")) return "frontRaise";
  if (pat.includes("crunch") || exName.includes("crunch") || exName.includes("releve de jambe") || exName.includes("abdo") || exName.includes("dead bug") || exName.includes("bird dog")) return "crunch";
  if (pat.includes("static") || exName.includes("gainage") || exName.includes("planche") || exName.includes("pallof")) return "plank";
  if (pat.includes("walk") || exName.includes("marche") || exName.includes("elliptique") || exName.includes("velo") || name.includes("mise en route") || name.includes("echauffement")) return "walk";
  if (pat.includes("breathe") || pat.includes("respiration") || exName.includes("respiration")) return "breathe";
  if (pat.includes("swim")) return "swim";

  // Fallbacks by muscle
  if (muscle === "pec") return "benchPress";
  if (muscle === "dos") return "row";
  if (muscle === "qua") return "squat";
  if (muscle === "isc") return "hinge";
  if (muscle === "fes") return "bridge";
  if (muscle === "bic") return "bicepCurl";
  if (muscle === "tri") return "tricepsExtension";
  if (muscle === "epL" || muscle === "epA") return "lateralRaise";
  if (muscle === "abs" || muscle === "tra" || muscle === "lom") return "crunch";
  if (muscle === "mol") return "calfRaise";

  return "generic";
}

const SKIN = "#E8C4A8";
const SKIN_SHADOW = "#D4A88A";
const CLOTH_TOP = "#2B2C2D";
const CLOTH_BOTTOM = "#3A3B3D";
const ACCENT = "#A8F0D0";
const HAIR = "#1A1A1A";
const WATER = "#4A90A8";

export default function HumanAnimation({
  exercise,
  movementName,
  pattern,
  muscle,
  paused = false,
  small = false,
  showLabel = true,
}) {
  const type = resolveAnimationType({ exercise, movementName, pattern, muscle: muscle || exercise?.muscle });
  const isPool = ["swim","staticSwim","gentleSwim","swimSprint","aquaJog","kneeRaise","scissor","lateral","buttKick","poolPushup","plankVertical","flutterKick","aquaWalk","aquaRest","stretchPool","shoulderMobility","hipMobility"].includes(type);
  const isBreathe = type === "breathe" || type === "aquaRest";

  return (
    <div className={`human-anim-container ${small ? "small" : ""} type-${type} ${paused ? "paused" : ""} ${isPool ? "pool" : "gym"}`}>
      <style>{`
        .human-anim-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          max-height: 320px;
          background: radial-gradient(ellipse at center, #1E1F20 0%, #151516 100%);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .human-anim-container.pool {
          background: radial-gradient(ellipse at center, #1A3A4A 0%, #0F2A3A 100%);
        }
        .human-anim-container.small {
          max-height: 200px;
          border-radius: 12px;
        }
        .human-anim-svg {
          width: 100%;
          height: 100%;
          max-width: 320px;
        }
        .human-anim-container.paused * {
          animation-play-state: paused !important;
        }
        .human-anim-label {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.7);
          color: #fff;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .human-anim-water {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 35%;
          background: linear-gradient(to top, rgba(74,144,168,0.3), transparent);
          pointer-events: none;
        }
        .human-anim-breathe-circle {
          position: absolute;
          width: 120px;
          height: 120px;
          border: 2px solid ${ACCENT};
          border-radius: 50%;
          opacity: 0.3;
          animation: breatheCircle 4s ease-in-out infinite;
        }
        @keyframes breatheCircle {
          0%, 100% { transform: scale(0.8); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
        /* Base human figure styles */
        .limb {
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        /* Squat */
        .type-squat .upper-leg { animation: squatUpperLeg 2s ease-in-out infinite; transform-origin: 90px 95px; }
        .type-squat .lower-leg { animation: squatLowerLeg 2s ease-in-out infinite; transform-origin: 90px 130px; }
        .type-squat .torso { animation: squatTorso 2s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-squat .upper-arm { animation: squatArm 2s ease-in-out infinite; transform-origin: 85px 55px; }
        @keyframes squatUpperLeg {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-70deg); }
        }
        @keyframes squatLowerLeg {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(70deg); }
        }
        @keyframes squatTorso {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(15px) rotate(10deg); }
        }
        @keyframes squatArm {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(30deg); }
        }
        /* Lunge */
        .type-lunge .leg-front-upper { animation: lungeFrontUpper 2.5s ease-in-out infinite; transform-origin: 90px 95px; }
        .type-lunge .leg-front-lower { animation: lungeFrontLower 2.5s ease-in-out infinite; transform-origin: 90px 130px; }
        .type-lunge .leg-back-upper { animation: lungeBackUpper 2.5s ease-in-out infinite; transform-origin: 110px 95px; }
        .type-lunge .leg-back-lower { animation: lungeBackLower 2.5s ease-in-out infinite; transform-origin: 110px 130px; }
        @keyframes lungeFrontUpper {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(-80deg); }
        }
        @keyframes lungeFrontLower {
          0%, 100% { transform: rotate(5deg); }
          50% { transform: rotate(80deg); }
        }
        @keyframes lungeBackUpper {
          0%, 100% { transform: rotate(10deg); }
          50% { transform: rotate(20deg); }
        }
        @keyframes lungeBackLower {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(-30deg); }
        }
        /* Hinge */
        .type-hinge .torso { animation: hingeTorso 2.2s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-hinge .upper-leg { animation: hingeLeg 2.2s ease-in-out infinite; transform-origin: 100px 95px; }
        @keyframes hingeTorso {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(75deg); }
        }
        @keyframes hingeLeg {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
        }
        /* Bridge */
        .type-bridge .torso { animation: bridgeTorso 2s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-bridge .upper-leg { animation: bridgeLeg 2s ease-in-out infinite; transform-origin: 100px 95px; }
        @keyframes bridgeTorso {
          0%, 100% { transform: translateY(20px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-15deg); }
        }
        @keyframes bridgeLeg {
          0%, 100% { transform: rotate(90deg); }
          50% { transform: rotate(70deg); }
        }
        /* Bench Press */
        .type-benchPress .upper-arm { animation: benchUpperArm 1.8s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-benchPress .lower-arm { animation: benchLowerArm 1.8s ease-in-out infinite; transform-origin: 70px 75px; }
        @keyframes benchUpperArm {
          0%, 100% { transform: rotate(-40deg); }
          50% { transform: rotate(20deg); }
        }
        @keyframes benchLowerArm {
          0%, 100% { transform: rotate(-80deg); }
          50% { transform: rotate(-20deg); }
        }
        /* Overhead Press */
        .type-overheadPress .upper-arm { animation: ohpUpper 2s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-overheadPress .lower-arm { animation: ohpLower 2s ease-in-out infinite; transform-origin: 70px 75px; }
        @keyframes ohpUpper {
          0%, 100% { transform: rotate(-80deg); }
          50% { transform: rotate(-170deg); }
        }
        @keyframes ohpLower {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(10deg); }
        }
        /* Row */
        .type-row .upper-arm { animation: rowUpper 2s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-row .lower-arm { animation: rowLower 2s ease-in-out infinite; transform-origin: 70px 75px; }
        .type-row .torso { animation: rowTorso 2s ease-in-out infinite; transform-origin: 100px 95px; }
        @keyframes rowUpper {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(-40deg); }
        }
        @keyframes rowLower {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(-90deg); }
        }
        @keyframes rowTorso {
          0%, 100% { transform: rotate(15deg); }
          50% { transform: rotate(5deg); }
        }
        /* Pullup */
        .type-pullup .upper-arm { animation: pullupUpper 2s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-pullup .lower-arm { animation: pullupLower 2s ease-in-out infinite; transform-origin: 70px 75px; }
        .type-pullup .torso { animation: pullupTorso 2s ease-in-out infinite; }
        @keyframes pullupUpper {
          0%, 100% { transform: rotate(-160deg); }
          50% { transform: rotate(-60deg); }
        }
        @keyframes pullupLower {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(-100deg); }
        }
        @keyframes pullupTorso {
          0%, 100% { transform: translateY(20px); }
          50% { transform: translateY(-10px); }
        }
        /* Bicep Curl */
        .type-bicepCurl .upper-arm { transform: rotate(-30deg); transform-origin: 85px 55px; }
        .type-bicepCurl .lower-arm { animation: curlLower 1.5s ease-in-out infinite; transform-origin: 70px 75px; }
        @keyframes curlLower {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(-120deg); }
        }
        /* Triceps */
        .type-tricepsExtension .upper-arm { transform: rotate(-90deg); transform-origin: 85px 55px; }
        .type-tricepsExtension .lower-arm { animation: tricepsLower 1.6s ease-in-out infinite; transform-origin: 70px 75px; }
        @keyframes tricepsLower {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(-130deg); }
        }
        /* Lateral Raise */
        .type-lateralRaise .upper-arm { animation: latRaise 2s ease-in-out infinite; transform-origin: 85px 55px; }
        @keyframes latRaise {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-80deg); }
        }
        /* Front Raise */
        .type-frontRaise .upper-arm { animation: frontRaise 2s ease-in-out infinite; transform-origin: 85px 55px; }
        @keyframes frontRaise {
          0%, 100% { transform: rotate(10deg); }
          50% { transform: rotate(-90deg); }
        }
        /* Crunch */
        .type-crunch .torso { animation: crunchTorso 1.8s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-crunch .upper-leg { animation: crunchLeg 1.8s ease-in-out infinite; transform-origin: 100px 95px; }
        @keyframes crunchTorso {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-30deg); }
        }
        @keyframes crunchLeg {
          0%, 100% { transform: rotate(90deg); }
          50% { transform: rotate(70deg); }
        }
        /* Plank */
        .type-plank .torso { animation: plankShake 3s ease-in-out infinite; }
        @keyframes plankShake {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(1px); }
        }
        /* Calf Raise */
        .type-calfRaise .lower-leg { animation: calfLower 1.2s ease-in-out infinite; transform-origin: 90px 130px; }
        @keyframes calfLower {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        /* Leg Extension */
        .type-legExtension .lower-leg { animation: legExtLower 2s ease-in-out infinite; transform-origin: 90px 130px; }
        @keyframes legExtLower {
          0%, 100% { transform: rotate(80deg); }
          50% { transform: rotate(0deg); }
        }
        /* Leg Curl */
        .type-legCurl .lower-leg { animation: legCurlLower 2s ease-in-out infinite; transform-origin: 90px 130px; }
        @keyframes legCurlLower {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(100deg); }
        }
        /* Abduction */
        .type-abduction .upper-leg { animation: abductionLeg 2s ease-in-out infinite; transform-origin: 100px 95px; }
        @keyframes abductionLeg {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-35deg); }
        }
        /* Swim */
        .type-swim .upper-arm { animation: swimArm 1.2s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-swim .upper-arm.right { animation-delay: 0.6s; }
        .type-swim .upper-leg { animation: swimLeg 1s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-swim .upper-leg.right { animation-delay: 0.5s; }
        @keyframes swimArm {
          0% { transform: rotate(-180deg); }
          50% { transform: rotate(0deg); }
          100% { transform: rotate(-180deg); }
        }
        @keyframes swimLeg {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        /* Aqua Jog */
        .type-aquaJog .upper-leg { animation: aquaJogLeg 0.8s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-aquaJog .upper-leg.right { animation-delay: 0.4s; }
        .type-aquaJog .upper-arm { animation: aquaJogArm 0.8s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-aquaJog .upper-arm.right { animation-delay: 0.4s; }
        @keyframes aquaJogLeg {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(45deg); }
        }
        @keyframes aquaJogArm {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(30deg); }
        }
        /* Knee Raise */
        .type-kneeRaise .upper-leg { animation: kneeRaiseLeg 1s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-kneeRaise .upper-leg.right { animation-delay: 0.5s; }
        @keyframes kneeRaiseLeg {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-90deg); }
        }
        /* Scissor */
        .type-scissor .upper-leg { animation: scissorLeg 0.6s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-scissor .upper-leg.right { animation: scissorLegRight 0.6s ease-in-out infinite; transform-origin: 100px 95px; }
        @keyframes scissorLeg {
          0%, 100% { transform: rotate(-15deg) translateX(-10px); }
          50% { transform: rotate(15deg) translateX(10px); }
        }
        @keyframes scissorLegRight {
          0%, 100% { transform: rotate(15deg) translateX(10px); }
          50% { transform: rotate(-15deg) translateX(-10px); }
        }
        /* Lateral */
        .type-lateral .torso { animation: lateralTorso 1s ease-in-out infinite; }
        .type-lateral .upper-leg { animation: lateralLeg 1s ease-in-out infinite; transform-origin: 100px 95px; }
        @keyframes lateralTorso {
          0%, 100% { transform: translateX(-15px); }
          50% { transform: translateX(15px); }
        }
        @keyframes lateralLeg {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(20deg); }
        }
        /* Butt Kick */
        .type-buttKick .lower-leg { animation: buttKickLower 0.7s ease-in-out infinite; transform-origin: 90px 130px; }
        .type-buttKick .lower-leg.right { animation-delay: 0.35s; }
        @keyframes buttKickLower {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(120deg); }
        }
        /* Pool Pushup */
        .type-poolPushup .upper-arm { animation: poolPushupArm 1.5s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-poolPushup .torso { animation: poolPushupTorso 1.5s ease-in-out infinite; transform-origin: 100px 95px; }
        @keyframes poolPushupArm {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(-80deg); }
        }
        @keyframes poolPushupTorso {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        /* Flutter Kick */
        .type-flutterKick .lower-leg { animation: flutterLower 0.4s ease-in-out infinite; transform-origin: 90px 130px; }
        .type-flutterKick .lower-leg.right { animation-delay: 0.2s; }
        @keyframes flutterLower {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        /* Aqua Walk */
        .type-aquaWalk .upper-leg { animation: aquaWalkLeg 1.2s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-aquaWalk .upper-leg.right { animation-delay: 0.6s; }
        @keyframes aquaWalkLeg {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(25deg); }
        }
        /* Breathe */
        .type-breathe .torso { animation: breatheTorso 4s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-breathe .head { animation: breatheHead 4s ease-in-out infinite; }
        @keyframes breatheTorso {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes breatheHead {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        /* Generic */
        .type-generic .upper-arm { animation: genericArm 2s ease-in-out infinite; transform-origin: 85px 55px; }
        @keyframes genericArm {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(20deg); }
        }
        /* Walk */
        .type-walk .upper-leg { animation: walkLeg 1s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-walk .upper-leg.right { animation-delay: 0.5s; }
        .type-walk .upper-arm { animation: walkArm 1s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-walk .upper-arm.right { animation-delay: 0.5s; }
        @keyframes walkLeg {
          0%, 100% { transform: rotate(-25deg); }
          50% { transform: rotate(25deg); }
        }
        @keyframes walkArm {
          0%, 100% { transform: rotate(25deg); }
          50% { transform: rotate(-25deg); }
        }
        /* Stretch */
        .type-stretch .torso { animation: stretchTorso 3s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-stretch .upper-arm { animation: stretchArm 3s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-stretchPec .upper-arm { animation: stretchPecArm 3s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-stretchBack .torso { animation: stretchBackTorso 3s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-stretchQuad .lower-leg { animation: stretchQuadLeg 3s ease-in-out infinite; transform-origin: 90px 130px; }
        .type-stretchHamstring .torso { animation: hingeTorso 3s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-stretchGlute .upper-leg { animation: stretchGluteLeg 3s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-stretchCalf .lower-leg { animation: calfLower 3s ease-in-out infinite; transform-origin: 90px 130px; }
        .type-stretchPool .torso { animation: stretchTorso 3s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-shoulderMobility .upper-arm { animation: shoulderMobilityArm 2s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-hipMobility .upper-leg { animation: hipMobilityLeg 2s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-plankVertical .torso { animation: plankShake 3s ease-in-out infinite; }
        .type-aquaRest .torso { animation: breatheTorso 4s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-aquaWalk .upper-leg { animation: aquaWalkLeg 1.2s ease-in-out infinite; transform-origin: 100px 95px; }
        .type-aquaWalk .upper-leg.right { animation-delay: 0.6s; }
        .type-gentleSwim .upper-arm { animation: gentleSwimArm 2s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-staticSwim .upper-leg { animation: flutterLower 0.6s ease-in-out infinite; transform-origin: 90px 130px; }
        .type-swimSprint .upper-arm { animation: swimArm 0.8s ease-in-out infinite; transform-origin: 85px 55px; }
        .type-swimSprint .upper-arm.right { animation-delay: 0.4s; }
        @keyframes stretchTorso {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
        }
        @keyframes stretchArm {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(-120deg); }
        }
        @keyframes stretchPecArm {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(-90deg); }
        }
        @keyframes stretchBackTorso {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(10deg) translateY(5px); }
        }
        @keyframes stretchQuadLeg {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(110deg); }
        }
        @keyframes stretchGluteLeg {
          0%, 100% { transform: rotate(90deg); }
          50% { transform: rotate(110deg); }
        }
        @keyframes shoulderMobilityArm {
          0% { transform: rotate(-20deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(-20deg); }
        }
        @keyframes hipMobilityLeg {
          0%, 100% { transform: rotate(-10deg); }
          25% { transform: rotate(30deg); }
          75% { transform: rotate(-30deg); }
        }
        @keyframes gentleSwimArm {
          0%, 100% { transform: rotate(-40deg); }
          50% { transform: rotate(-100deg); }
        }
      `}</style>

      {/* Water effect for pool */}
      {isPool && <div className="human-anim-water" />}

      {/* Breathe circle */}
      {isBreathe && <div className="human-anim-breathe-circle" />}

      <svg className="human-anim-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow */}
        <ellipse cx="100" cy="185" rx="35" ry="5" fill="rgba(0,0,0,0.3)" />

        {/* Legs - back */}
        <g className="leg leg-back">
          <g className="upper-leg right" style={{ transformOrigin: "110px 95px" }}>
            <line x1="110" y1="95" x2="110" y2="130" stroke={CLOTH_BOTTOM} strokeWidth="10" strokeLinecap="round" className="limb" />
            <g className="lower-leg right" style={{ transformOrigin: "110px 130px" }}>
              <line x1="110" y1="130" x2="110" y2="165" stroke={SKIN} strokeWidth="8" strokeLinecap="round" className="limb" />
              <ellipse cx="110" cy="172" rx="8" ry="4" fill={SKIN_SHADOW} />
            </g>
          </g>
        </g>

        {/* Legs - front */}
        <g className="leg leg-front">
          <g className="upper-leg leg-front-upper" style={{ transformOrigin: "90px 95px" }}>
            <line x1="90" y1="95" x2="90" y2="130" stroke={CLOTH_BOTTOM} strokeWidth="10" strokeLinecap="round" className="limb" />
            <g className="lower-leg leg-front-lower" style={{ transformOrigin: "90px 130px" }}>
              <line x1="90" y1="130" x2="90" y2="165" stroke={SKIN} strokeWidth="8" strokeLinecap="round" className="limb" />
              <ellipse cx="90" cy="172" rx="8" ry="4" fill={SKIN_SHADOW} />
            </g>
          </g>
          <g className="upper-leg" style={{ transformOrigin: "100px 95px" }}>
            {/* Second leg for generic animations */}
            <g className="upper-leg right" style={{ display: type === 'squat' || type === 'hinge' || type === 'bridge' ? 'none' : 'block' }}>
            </g>
          </g>
        </g>

        {/* Torso */}
        <g className="torso" style={{ transformOrigin: "100px 95px" }}>
          <path d="M 85 50 Q 100 45 115 50 L 112 95 Q 100 100 88 95 Z" fill={CLOTH_TOP} stroke="#1A1A1A" strokeWidth="0.5" />
          {/* Accent stripe */}
          <path d="M 88 70 Q 100 72 112 70 L 111 75 Q 100 77 89 75 Z" fill={ACCENT} opacity="0.8" />
        </g>

        {/* Arms - back */}
        <g className="arm arm-back">
          <g className="upper-arm right" style={{ transformOrigin: "115px 55px" }}>
            <line x1="115" y1="55" x2="130" y2="75" stroke={SKIN} strokeWidth="7" strokeLinecap="round" className="limb" />
            <g className="lower-arm right" style={{ transformOrigin: "130px 75px" }}>
              <line x1="130" y1="75" x2="140" y2="95" stroke={SKIN} strokeWidth="6" strokeLinecap="round" className="limb" />
              <circle cx="142" cy="97" r="5" fill={SKIN} />
            </g>
          </g>
        </g>

        {/* Arms - front */}
        <g className="arm arm-front">
          <g className="upper-arm" style={{ transformOrigin: "85px 55px" }}>
            <line x1="85" y1="55" x2="70" y2="75" stroke={SKIN} strokeWidth="7" strokeLinecap="round" className="limb" />
            <g className="lower-arm" style={{ transformOrigin: "70px 75px" }}>
              <line x1="70" y1="75" x2="60" y2="95" stroke={SKIN} strokeWidth="6" strokeLinecap="round" className="limb" />
              <circle cx="58" cy="97" r="5" fill={SKIN} />
            </g>
          </g>
        </g>

        {/* Head */}
        <g className="head" style={{ transformOrigin: "100px 35px" }}>
          <circle cx="100" cy="25" r="14" fill={SKIN} stroke={SKIN_SHADOW} strokeWidth="1" />
          <circle cx="100" cy="25" r="12" fill={SKIN} />
          {/* Hair */}
          <path d="M 88 18 Q 100 5 112 18 Q 110 12 100 10 Q 90 12 88 18" fill={HAIR} />
          {/* Face hint */}
          <circle cx="96" cy="24" r="1.2" fill="#333" />
          <circle cx="104" cy="24" r="1.2" fill="#333" />
          <path d="M 97 29 Q 100 31 103 29" stroke="#333" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>

        {/* Equipment hints */}
        {type.includes("Press") || type === "benchPress" || type === "overheadPress" ? (
          <g className="equipment" opacity="0.9">
            <rect x="45" y="92" width="70" height="6" rx="3" fill="#888" stroke="#666" strokeWidth="0.5" />
            <circle cx="48" cy="95" r="8" fill="#555" />
            <circle cx="112" cy="95" r="8" fill="#555" />
          </g>
        ) : null}
        {type === "bicepCurl" || type === "lateralRaise" || type === "frontRaise" ? (
          <g className="equipment">
            <circle cx="58" cy="97" r="6" fill="#666" stroke="#444" strokeWidth="0.5" />
            <circle cx="142" cy="97" r="6" fill="#666" stroke="#444" strokeWidth="0.5" />
          </g>
        ) : null}

        {/* Pool water line */}
        {isPool && (
          <>
            <path d="M 0 120 Q 50 115 100 120 T 200 120 L 200 200 L 0 200 Z" fill={WATER} opacity="0.15" />
            <path d="M 0 125 Q 50 120 100 125 T 200 125" stroke={WATER} strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="5 5">
              <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
            </path>
          </>
        )}
      </svg>

      {showLabel && (
        <div className="human-anim-label">
          {movementName || exercise?.name || type}
        </div>
      )}
    </div>
  );
}
