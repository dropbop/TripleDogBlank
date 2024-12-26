// Simulation Logic
function simulateWar(numSimulations = 1000, numDecks = 1) {
    const gameLengths = [];
    const outcomes = []; // 0 for player 1 wins, 1 for player 2 wins, -1 for tie/max rounds

    for (let i = 0; i < numSimulations; i++) {
        // Create the deck(s)
        let deck = [];
        for (let d = 0; d < numDecks; d++) {
            for (let rank = 2; rank <= 14; rank++) { // 11=J, 12=Q, 13=K, 14=A
                for (let suit = 0; suit < 4; suit++) {
                    deck.push({ rank, suit });
                }
            }
        }
        // Shuffle the deck
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        // Deal the cards
        const player1 = deck.slice(0, deck.length / 2);
        const player2 = deck.slice(deck.length / 2);

        let rounds = 0;
        while (player1.length > 0 && player2.length > 0 && rounds < 2000) {
            rounds++;
            const card1 = player1.shift();
            const card2 = player2.shift();

            if (card1.rank > card2.rank) {
                player1.push(card1, card2);
            } else if (card2.rank > card1.rank) {
                player2.push(card2, card1);
            } else { // War
                const warPile = [card1, card2];
                while (card1.rank === card2.rank && player1.length > 0 && player2.length > 0) {
                    if (player1.length < 4) { // Player 1 doesn't have enough cards for war
                        warPile.push(...player1.splice(0, player1.length));
                        break;
                    } else if (player2.length < 4) { // Player 2 doesn't have enough cards for war
                        warPile.push(...player2.splice(0, player2.length));
                        break;
                    } else { // Both players have enough cards
                        for (let j = 0; j < 3; j++) { // Put down 3 cards face down
                            warPile.push(player1.shift(), player2.shift());
                        }

                        if (player1.length === 0 || player2.length === 0) { // Check if a player ran out of cards
                            break;
                        }

                        const nextCard1 = player1.shift(); // Next face-up card
                        const nextCard2 = player2.shift();
                        warPile.push(nextCard1, nextCard2);
                    }
                }

                if (player1.length > 0 && (player2.length === 0 || nextCard1.rank > nextCard2.rank)) {
                    player1.push(...warPile);
                } else if (player2.length > 0 && (player1.length === 0 || nextCard2.rank > nextCard1.rank)) {
                    player2.push(...warPile);
                }
            }
        }

        gameLengths.push(rounds);
        if (player2.length === 0) {
            outcomes.push(0);
        } else if (player1.length === 0) {
            outcomes.push(1);
        } else {
            outcomes.push(-1);
        }
    }

    return { gameLengths, outcomes };
}

// Integration with the Interface
document.getElementById('run-simulation').addEventListener('click', function () {
    // Get input values
    const numDecks = parseInt(document.getElementById('num-decks').value, 10);
    const numGames = parseInt(document.getElementById('num-games').value, 10);

    // Run the simulation
    const { gameLengths, outcomes } = simulateWar(numGames, numDecks);

    // Calculate statistics
    const avgGameLength = gameLengths.reduce((sum, len) => sum + len, 0) / gameLengths.length;
    const player1Wins = outcomes.filter(outcome => outcome === 0).length;
    const player2Wins = outcomes.filter(outcome => outcome === 1).length;
    const ties = outcomes.filter(outcome => outcome === -1).length;

    // Format the results
    const results = `
Simulating ${numGames} games with ${numDecks} deck(s).
Average game length: ${avgGameLength.toFixed(2)} rounds
Player 1 wins: ${((player1Wins / outcomes.length) * 100).toFixed(2)}%
Player 2 wins: ${((player2Wins / outcomes.length) * 100).toFixed(2)}%
Ties/Max rounds reached: ${((ties / outcomes.length) * 100).toFixed(2)}%
    `;

    // Display the results
    document.getElementById('results-output').textContent = results;
});
