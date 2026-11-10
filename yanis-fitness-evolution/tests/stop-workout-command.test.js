import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isStopWorkoutCommand } from '../src/engine/stop-workout-command.js';

test('seule une demande explicite clôture la séance en cours', () => {
  for (const text of ['Stoppe ma séance', 'Arrête ma séance', 'Je veux stopper ma séance', 'Termine la séance', 'clôture cette séance', 'Arrête mon entraînement', 'Mets fin à ma séance', 'Je veux terminer l’entraînement', 'Terminons le workout']) assert.equal(isStopWorkoutCommand(text), true, text);
  for (const text of ["N'arrête pas ma séance", 'Ne stoppe pas ma séance', 'Comment arrêter ma séance ?', 'Arrête ma séance de demain', 'Stoppe mon exercice', 'J’ai terminé ma séance hier', 'ma séance est terminée ?', 'Arrête le minuteur', 'Retiens que je veux arrêter ma séance', 'Arrête ma séance, j’ai mal au dos', 'Arrête cet exercice pendant ma séance', 'Je vais arrêter ma séance demain']) assert.equal(isStopWorkoutCommand(text), false, text);
});
