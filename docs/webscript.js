// Simulation Logic
function simulateWar(numSimulations = 1000, numDecks = 1) {
    const gameLengths = [];
    const outcomes = []; // 0 for player 1 wins, 1 for player 2 wins, -1 for tie/max rounds

    for (let sim = 0; sim < numSimulations; sim++) {
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
                let warPile = [card1, card2];
                let nextCard1, nextCard2;

                while (card1.rank === card2.rank && player1.length > 0 && player2.length > 0) {
                    // Take 3 face-down cards if possible
                    for (let j = 0; j < 3; j++) {
                        if (player1.length > 0) warPile.push(player1.shift());
                        if (player2.length > 0) warPile.push(player2.shift());
                    }

                    // Draw next face-up cards
                    if (player1.length > 0 && player2.length > 0) {
                        nextCard1 = player1.shift();
                        nextCard2 = player2.shift();
                        warPile.push(nextCard1, nextCard2);
                    } else {
                        // If any player can't draw, they lose the war
                        break;
                    }

                    if (nextCard1.rank > nextCard2.rank) {
                        player1.push(...warPile);
                        break;
                    } else if (nextCard2.rank > nextCard1.rank) {
                        player2.push(...warPile);
                        break;
                    } else {
                        // Continue war with the new cards
                        card1 = nextCard1;
                        card2 = nextCard2;
                    }
                }

                // If one player runs out of cards during war
                if (player1.length === 0 || player2.length === 0) {
                    if (player1.length > player2.length) {
                        player1.push(...warPile);
                    } else {
                        player2.push(...warPile);
                    }
                }
            }
        }

        gameLengths.push(rounds);
        if (player1.length > 0) {
            outcomes.push(0); // Player 1 wins
        } else if (player2.length > 0) {
            outcomes.push(1); // Player 2 wins
        } else {
            outcomes.push(-1); // Tie or max rounds reached
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
