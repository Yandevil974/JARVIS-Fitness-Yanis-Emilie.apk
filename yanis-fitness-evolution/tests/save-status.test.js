import test from 'node:test';
import assert from 'node:assert/strict';
import {saveProblem} from '../src/store/save-status.js';

test('le message explique le bon motif, recommande une sauvegarde et ne parle pas toujours d’aperçu', () => {
  assert.equal(saveProblem({ok:true,mode:'IndexedDB'}),null);
  const validation = saveProblem({ok:false,mode:'validation',error:'Enregistrement refusé : Unité de série invalide.'});
  assert.match(validation.title,/données à vérifier/i);
  assert.match(validation.message,/Unité de série invalide/);
  assert.doesNotMatch(validation.message,/stockage.*indisponible/i);
  const conflict = saveProblem({ok:false,mode:'conflit'});
  assert.match(conflict.message,/plus récente/i);
  const protection = saveProblem({ok:false,mode:'protection'});
  assert.match(protection.message,/copies originales/i);
  const memory = saveProblem({ok:false,mode:'mémoire'});
  assert.match(memory.message,/restent en mémoire/i);
  assert.match(saveProblem({ok:false,mode:'inconnu'}).message,/cause.*pas pu être déterminée/i);
  for (const issue of [validation,conflict,protection,memory]) {
    assert.match(issue.message,/Exportez une sauvegarde avant de fermer/i);
    assert.match(issue.message,/Ne désinstallez pas/i);
    assert.doesNotMatch(issue.message,/dans cet aperçu/i);
  }
});
