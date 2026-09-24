# Inventaire exhaustif — Transformation_Elite_V2.html

Empreinte SHA-256 : 65abe085e032fc56c1eeb0a768cba873f16a57ee839e7d6633978d5fcc27a337

9 644 260 caractères lus. 2 blocs script analysés. Les blocs Cloudflare ajoutés en fin de fichier ne sont pas transférés (aucune fonction sportive).

| Fonction | Lignes du script principal | État consulté/modifié |
|---|---|---|
| `numOr` | 820–825 | — |
| `parseDate` | 830–830 | — |
| `dateKey` | 831–831 | — |
| `todayKey` | 832–832 | — |
| `addDays` | 833–833 | — |
| `monthKeyOf` | 834–834 | — |
| `fmtDateFr` | 835–835 | — |
| `fmtDateShort` | 836–836 | — |
| `norm` | 837–837 | — |
| `defaultState` | 840–861 | — |
| `storageAvailable` | 868–877 | — |
| `save` | 878–891 | — |
| `load` | 892–896 | — |
| `resetAll` | 897–900 | — |
| `showStorageBanner` | 901–901 | — |
| `hideStorageBanner` | 902–902 | — |
| `isTextInput` | 910–919 | — |
| `stepField` | 924–934 | — |
| `debounceSave` | 956–959 | — |
| `flashSaved` | 960–967 | — |
| `autoActivateIfComplete` | 974–985 | state.profil, state.poids, state.mg, state.nutri.phase |
| `bindAutoSave` | 986–1018 | state.profil, state.mensurations.jour, state.journal |
| `toast` | 1022–1027 | — |
| `openModal` | 1028–1033 | — |
| `closeModal` | 1034–1034 | — |
| `buildNav` | 1038–1043 | — |
| `openMoreNav` | 1044–1047 | — |
| `go` | 1048–1054 | — |
| `renderView` | 1055–1072 | — |
| `startDate` | 1075–1075 | state.profil.date |
| `programPos` | 1076–1085 | — |
| `nbSemainesEcoulees` | 1086–1090 | state.profil.date |
| `nbJoursEcoules` | 1091–1094 | state.profil.date |
| `weekPlan` | 1097–1134 | state.profil.seancesSemaine |
| `planifieMois` | 1135–1138 | — |
| `bmr` | 1141–1144 | — |
| `tdee` | 1145–1150 | — |
| `objectifPrincipalTexte` | 1151–1160 | state.objectifs.principal |
| `phaseNutritionRecommandee` | 1161–1169 | state.profil.mg, state.objectifs.principal |
| `caloriesCibles` | 1170–1187 | state.profil, state.nutri.phase, state.objectifs.principal, state.nutri.ajustement, state.profil.poidsDepart |
| `nutriPhaseInfo` | 1188–1196 | state.nutri.phase |
| `strategieAnnuelle` | 1197–1214 | — |
| `ajustementAuto` | 1215–1239 | state.poids, state.nutri.phase, state.objectifs.principal |
| `macroJour` | 1240–1248 | state.profil.poidsDepart, state.nutri.ajustement |
| `genererPlanJour` | 1250–1288 | — |
| `genererPlanRepas` | 1289–1289 | — |
| `signauxEntrainement` | 1292–1344 | state.profil.date, state.seances, state.journal |
| `sundayDeSemaine` | 1347–1349 | — |
| `bilanHebdoEtat` | 1350–1358 | state.profil.date, state.hebdo |
| `donneesManquantesHebdo` | 1359–1380 | state.profil.date, state.poids, state.recup, state.seances, state.mensurations.mensuel |
| `genererConseilsHebdo` | 1381–1425 | — |
| `setupCanvas` | 1428–1437 | — |
| `drawEmpty` | 1438–1445 | — |
| `lineChart` | 1446–1517 | — |
| `barChart` | 1518–1546 | — |
| `gaugeSVG` | 1550–1560 | — |
| `recupScore` | 1563–1570 | — |
| `recupStatus` | 1571–1577 | — |
| `moyenneRecup` | 1578–1582 | state.recup |
| `est1RM` | 1591–1591 | — |
| `perfSerie` | 1592–1605 | state.journal |
| `perfHistorique` | 1606–1621 | state.journal |
| `volumeHebdo` | 1622–1631 | state.journal |
| `volumeMuscles` | 1632–1644 | — |
| `statutMuscle` | 1645–1649 | — |
| `echauffementPour` | 1652–1666 | — |
| `etirementsPour` | 1667–1677 | — |
| `prepEtat` | 1678–1681 | state.journal |
| `togglePrep` | 1682–1702 | state.journal |
| `forceTestDone` | 1704–1707 | state.force |
| `nextReevalDate` | 1708–1712 | state.force |
| `forceReevalDue` | 1713–1716 | — |
| `forceJoursRestants` | 1717–1720 | — |
| `pctPourReps` | 1722–1732 | — |
| `roundCharge` | 1733–1736 | — |
| `matchBase` | 1738–1748 | state.force, state.force.valeurs |
| `exo1RMEstimeJournal` | 1754–1767 | state.journal |
| `base1RMJournal` | 1769–1782 | state.journal |
| `exo1RMEffectif` | 1784–1801 | state.force, state.force.valeurs |
| `derniereEntreeExercice` | 1803–1812 | state.journal |
| `hautDeFourchette` | 1814–1820 | — |
| `chargeSuggestion` | 1823–1855 | — |
| `auto1RMParMouvement` | 1857–1865 | state.force, state.force.valeurs |
| `forceDelta` | 1866–1872 | state.force |
| `checkBadges` | 1905–1950 | state.badges.includes, state.journal, state.recup, state.mensurations.mensuel, state.photos, state.profil.objectifPoids, state.poids, state.objectifs.principal |
| `scoreDiscipline` | 1953–1958 | state.seances |
| `scoreAdherenceGlobal` | 1959–1969 | state.profil.date, state.seances |
| `scoreTransformation` | 1970–1994 | state.nutri.journal, state.recup |
| `scoreProgressionMesures` | 1995–2008 | state.mensurations.jour, state.objectifs.cibles |
| `scorePerformance` | 2009–2021 | — |
| `progressionObjectifAnnuel` | 2022–2030 | state.profil |
| `poidsActuel` | 2031–2034 | state.poids, state.profil.poidsDepart |
| `dernierMensuration` | 2035–2039 | state.mensurations.mensuel |
| `photoSrc` | 2043–2047 | — |
| `compressImage` | 2048–2064 | — |
| `exportData` | 2067–2073 | — |
| `importData` | 2074–2083 | — |
| `openSettings` | 2084–2094 | — |
| `printReport` | 2095–2097 | — |
| `renderCurrent` | 2109–2109 | — |
| `buildRecommendations` | 2112–2191 | state.profil, state.poids, state.mensurations.jour, state.recup, state.force, state.force.valeurs |
| `renderDashHebdo` | 2195–2235 | state.profil.date, state.hebdo |
| `renderDashRepas` | 2237–2252 | state.profil |
| `renderDashboard` | 2254–2336 | state.profil, state.recup, state.mensurations.jour, state.seances, state.badges, state.objectifs.principal |
| `tile` | 2337–2340 | — |
| `recItem` | 2341–2343 | — |
| `renderProfil` | 2346–2360 | state.profil, state.force.date |
| `calcIMC` | 2361–2364 | — |
| `renderMensJ0` | 2365–2376 | state.mensurations.jour |
| `renderPhotosJ0` | 2377–2381 | — |
| `photoCard` | 2382–2390 | state.photos |
| `photoUpload` | 2391–2397 | state.photos |
| `saveProfil` | 2398–2423 | state.profil.date, state.profil, state.poids, state.profil.poidsDepart, state.mensurations.jour, state.profil.mg, state.mg, state.nutri.phase |
| `saveProfilLight` | 2424–2424 | — |
| `renderForce` | 2427–2487 | state.force |
| `calcEst1RM` | 2488–2494 | — |
| `saveForceTest` | 2495–2512 | state.force, state.force.date, state.force.valeurs, state.force.historique |
| `importerPR` | 2513–2522 | — |
| `renderRepas` | 2526–2580 | state.profil, state.profil.poidsDepart |
| `repasNav` | 2581–2585 | — |
| `repasAller` | 2586–2586 | — |
| `openRepasDate` | 2587–2591 | — |
| `renderMensurations` | 2594–2640 | state.profil.poidsDepart, state.mg, state.profil.mg, state.mensurations.mensuel, state.poids, state.mensurations.jour |
| `dernierMensurationDate` | 2641–2644 | state.mensurations.mensuel |
| `addWeight` | 2645–2649 | state.poids |
| `addMG` | 2650–2654 | state.mg |
| `openMensModal` | 2655–2670 | state.mensurations.mensuel |
| `saveMensModal` | 2671–2677 | state.mensurations.mensuel |
| `renderEntrainement` | 2680–2738 | state.profil, state.seances |
| `semaineLabel` | 2740–2743 | — |
| `chargerJournalDate` | 2744–2747 | state.journal |
| `renderEntHist` | 2748–2806 | state.profil, state.ui, state.ui.entHistWeek, state.seances |
| `entHistNav` | 2807–2815 | state.ui, state.ui.entHistWeek |
| `entHistToday` | 2816–2820 | state.ui, state.ui.entHistWeek |
| `renderEntProgress` | 2821–2884 | state.profil, state.journal, state.ui, state.ui.entProgExo |
| `entProgSelect` | 2885–2889 | state.ui, state.ui.entProgExo |
| `stat` | 2890–2890 | — |
| `ouvrirPhase` | 2891–2906 | — |
| `coachMotSession` | 2909–2941 | — |
| `openSession` | 2942–3031 | state.journal |
| `saveSessionStatut` | 3032–3047 | state.journal, state.seances |
| `readSessionInputs` | 3048–3056 | — |
| `saveSession` | 3057–3075 | state.journal, state.seances |
| `setSeanceStatus` | 3076–3076 | state.seances, state.journal |
| `renderNutrition` | 3079–3137 | state.profil, state.nutri.phase, state.nutri.journal |
| `selectMoisPlan` | 3139–3144 | — |
| `changePhase` | 3145–3150 | state.nutri.phase, state.nutri.ajustement, state.objectifs.principal |
| `saveNutri` | 3151–3153 | state.nutri.auto |
| `openFoodModal` | 3154–3160 | — |
| `addFood` | 3161–3169 | state.nutri.journal |
| `delFood` | 3170–3175 | state.nutri.journal |
| `renderRecuperation` | 3178–3214 | state.recup |
| `saveRecup` | 3215–3222 | state.recup |
| `bindRanges` | 3223–3227 | — |
| `renderProgression` | 3230–3270 | state.mensurations.jour |
| `goBilan` | 3271–3271 | — |
| `renderPhotos` | 3274–3301 | state.photos.m, state.photos.j |
| `loadComparison` | 3302–3328 | state.photos |
| `renderCalendrier` | 3331–3375 | state.profil.date, state.calOffset, state.seances |
| `calNav` | 3376–3376 | state.calOffset |
| `openDay` | 3377–3407 | state.seances, state.journal, state.recup, state.poids |
| `setSeanceDay` | 3408–3408 | — |
| `saveDayQuick` | 3409–3413 | state.poids |
| `autoFillCalendar` | 3414–3418 | state.journal, state.seances |
| `renderObjectifs` | 3421–3484 | state.profil, state.objectifs.principal, state.objectifs.cibles, state.mensurations.jour, state.mg, state.objectifsMensuels, state.badges.includes, state.badgesNouveaux.includes |
| `setObjectifPrincipal` | 3485–3485 | state.objectifs.principal, state.nutri.phase |
| `saveCibles` | 3486–3490 | state.objectifs.cibles |
| `genererObjectifsMensuels` | 3491–3514 | state.profil.seancesSemaine, state.objectifsMensuels, state.seances, state.recup, state.poids, state.mensurations.mensuel |
| `validerObjMensuel` | 3515–3521 | state.objectifsMensuels |
| `genererAutoObjMensuels` | 3522–3526 | state.objectifsMensuels |
| `openBilanHebdoModal` | 3529–3560 | state.hebdo |
| `saveBilanHebdo` | 3561–3579 | state.hebdo |
| `renderTeamHebdo` | 3580–3609 | state.hebdo, state.profil.date |
| `openBilanAncien` | 3610–3622 | state.hebdo |
| `renderEquipe` | 3625–3671 | state.profil, state.force.valeurs.bench, state.force.valeurs.squat, state.force.valeurs.dead |
| `renderBilan` | 3674–3684 | state.bilanVu |
| `genererBilan` | 3685–3802 | state.profil, state.mensurations.jour, state.mensurations.mensuel, state.poids, state.profil.date, state.seances, state.recup, state.nutri.journal |
| `cell` | 3803–3805 | — |
| `applyEmbeddedPhotos` | 3808–3822 | state.photos |
| `V2S` | 3831–3839 | state.natation, state.natation.jours, state.cardio, state.tabata, state.stretchSuivi, state.ui |
| `_fmtDur` | 3843–3843 | — |
| `_protoDur` | 3844–3844 | — |
| `_R` | 3845–3849 | — |
| `beep` | 3851–3860 | — |
| `_aquaTours` | 3865–3873 | — |
| `poolDays` | 3875–3882 | state.natation |
| `togglePoolDay` | 3883–3891 | state.natation.jours, state.natation.jours.slice, state.natation.planDim |
| `_aquaTabata` | 3892–3902 | — |
| `ensureTimerRoot` | 3963–3967 | — |
| `_fmtT` | 3968–3968 | — |
| `_runSteps` | 3969–3977 | — |
| `_tick` | 3978–3993 | — |
| `_renderTimer` | 3994–4007 | — |
| `_renderTimerNums` | 4008–4013 | — |
| `_timerPause` | 4014–4014 | — |
| `_timerSkip` | 4015–4015 | — |
| `_timerStop` | 4016–4016 | — |
| `_finishTimer` | 4017–4028 | — |
| `_timerSetRpe` | 4029–4029 | — |
| `_saveProtoResult` | 4030–4044 | state.journal, state.seances |
| `delProtoRow` | 4045–4050 | — |
| `startProtocol` | 4053–4058 | — |
| `startTabata` | 4059–4065 | — |
| `_cardioSteps` | 4066–4082 | — |
| `startCardio` | 4083–4088 | — |
| `restTimerBarHTML` | 4094–4096 | — |
| `startRestTimer` | 4097–4107 | — |
| `_restTick` | 4108–4124 | — |
| `_restAdd` | 4125–4125 | — |
| `stopRestTimer` | 4126–4126 | — |
| `mediaForExo` | 4178–4182 | — |
| `tempoDecode` | 4183–4187 | — |
| `_cls` | 4188–4188 | — |
| `svgAnatomy` | 4189–4230 | — |
| `openDemoOverlay` | 4233–4239 | — |
| `closeDemo` | 4240–4243 | — |
| `demoPause` | 4244–4244 | — |
| `demoSpeed` | 4245–4245 | — |
| `demoReplay` | 4246–4246 | — |
| `openDemo` | 4247–4268 | state.ui.demosVues |
| `_openExoDemo` | 4269–4278 | — |
| `openExoDemoIdx` | 4279–4279 | — |
| `openExoDemoByRef` | 4280–4283 | — |
| `openDemoByName` | 4284–4292 | — |
| `openStretchDemo` | 4293–4305 | — |
| `renderPiscine` | 4310–4331 | state.natation.seances |
| `togglePoolDim` | 4332–4332 | state.natation.planDim |
| `_histMini` | 4333–4337 | — |
| `renderCardio` | 4338–4355 | state.tabata.seances, state.cardio.seances |
| `athleteBriefing` | 4360–4392 | state.profil, state.recup, state.journal |
| `bodyScannerHTML` | 4393–4410 | — |
| `linReg` | 4411–4417 | — |
| `prediTrendHTML` | 4418–4433 | — |
| `selfTest` | 4438–4471 | state.cardio, state.tabata |
| `hudOn` | 4477–4477 | state.ui, state.ui.hud |
| `setHud` | 4478–4483 | state.ui.hud |
| `applyHud` | 4484–4498 | — |
| `athleteScore1000` | 4499–4505 | — |
| `speakBriefing` | 4506–4521 | state.recup |
| `hudBoot` | 4522–4544 | state.profil, state.recup |
| `_tabataSteps` | 4550–4559 | — |
| `_extraFam` | 4560–4566 | — |
| `_runFam` | 4567–4567 | — |
| `extraSteps` | 4568–4575 | — |
| `extraDuree` | 4576–4576 | — |
| `runLaunch` | 4577–4583 | — |
| `coachExtra` | 4584–4642 | state.recup, state.natation, state.natation.seances, state.cardio, state.cardio.seances |
| `extraDetail` | 4643–4650 | — |
| `openExtra` | 4651–4667 | — |
| `extrasDuJour` | 4672–4678 | — |
| `extrasHtml` | 4679–4683 | — |
| `_poolKey` | 4688–4697 | — |
| `poolStepsOf` | 4698–4701 | — |
| `comboSteps` | 4702–4707 | — |
| `startCombo` | 4708–4716 | — |
| `poolSummaryHtml` | 4721–4728 | — |
| `poolPhaseHtml` | 4733–4767 | — |
| `extraSeq` | 4773–4792 | state.profil, state.profil.seancesSemaine |
| `poolGuideFor` | 4818–4822 | — |
| `qBtn` | 4823–4828 | — |
| `qBtnTimer` | 4829–4837 | — |
| `openGuide` | 4890–4900 | — |
| `logExtraManu` | 4905–4938 | state.journal, state.seances, state.natation.seances.push, state.cardio.seances.push |
| `init` | 4940–4966 | state.profil.date, state.stats.demarrage |
| `speechSupported` | 4983–4983 | — |
| `ttsSupported` | 4984–4984 | — |
| `asAddMsg` | 4986–4993 | — |
| `asSay` | 4994–5007 | — |
| `asEnvoyerTexte` | 5008–5015 | — |
| `asTraiter` | 5016–5024 | — |
| `asToggleListen` | 5025–5059 | — |
| `asStopListen` | 5060–5063 | — |
| `asSetListening` | 5064–5070 | — |
| `asToggleMute` | 5071–5075 | — |
| `toggleAssistant` | 5076–5085 | — |
| `asNumber` | 5091–5094 | — |
| `assistantRepondre` | 5095–5393 | state.poids, state.recup, state.seances, state.profil.poidsDepart, state.force.valeurs, state.objectifs.principal, state.profil.objectifPoids, state.mensurations.jour |
| `asInit` | 5396–5404 | — |
| `asChip` | 5405–5408 | — |