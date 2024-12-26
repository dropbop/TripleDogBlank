document.addEventListener('DOMContentLoaded', () => {
    const numDecksInput = document.getElementById('num-decks');
    const numGamesInput = document.getElementById('num-games');
    const runSimulationButton = document.getElementById('run-simulation');
    const resultsOutput = document.getElementById('results-output');

    runSimulationButton.addEventListener('click', () => {
        const numDecks = parseInt(numDecksInput.value);
        const numGames = parseInt(numGamesInput.value);

        if (isNaN(numDecks) || numDecks < 1 || isNaN(numGames) || numGames < 1) {
            resultsOutput.textContent = 'Please enter valid numbers for decks and games.';
            return;
        }

        simulateWarGames(numDecks, numGames);
    });

    function createDeck(numDecks) {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];

        for (let d = 0; d < numDecks; d++) {
            for (const suit of suits) {
                for (const rank of ranks) {
                    deck.push({ rank, suit, value: ranks.indexOf(rank) });
                }
            }
        }
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    function dealCards(deck) {
        const player1Deck = [];
        const player2Deck = [];
        for (let i = 0; i < deck.length; i++) {
            if (i % 2 === 0) {
                player1Deck.push(deck[i]);
            } else {
                player2Deck.push(deck[i]);
            }
        }
        return { player1Deck, player2Deck };
    }

    function playWar(deck) {
        let { player1Deck, player2Deck } = dealCards(shuffleDeck(deck));
        let turns = 0;
        const maxTurns = 10000; // To prevent infinite loops in case of very long games

        while (player1Deck.length > 0 && player2Deck.length > 0 && turns < maxTurns) {
            turns++;
            const card1 = player1Deck.shift();
            const card2 = player2Deck.shift();

            if (card1.value > card2.value) {
                player1Deck.push(card1, card2);
            } else if (card2.value > card1.value) {
                player2Deck.push(card2, card1);
            } else {
                // War!
                const cardsAtStake1 = [card1];
                const cardsAtStake2 = [card2];
                let warOngoing = true;

                while (warOngoing && player1Deck.length > 0 && player2Deck.length > 0) {
                    if (player1Deck.length < 1 || player2Deck.length < 1) {
                        break; // Cannot continue war if a player has no cards
                    }

                    for (let i = 0; i < 3; i++) {
                        if (player1Deck.length > 0) {
                            cardsAtStake1.push(player1Deck.shift());
                        } else {
                            warOngoing = false;
                            break;
                        }
                        if (player2Deck.length > 0) {
                            cardsAtStake2.push(player2Deck.shift());
                        } else {
                            warOngoing = false;
                            break;
                        }
                    }

                    if (!warOngoing) break;

                    const warCard1 = cardsAtStake1[cardsAtStake1.length - 1];
                    const warCard2 = cardsAtStake2[cardsAtStake2.length - 1];

                    if (warCard1 && warCard2) {
                        if (warCard1.value > warCard2.value) {
                            player1Deck.push(...cardsAtStake1, ...cardsAtStake2);
                            warOngoing = false;
                        } else if (warCard2.value > warCard1.value) {
                            player2Deck.push(...cardsAtStake1, ...cardsAtStake2);
                            warOngoing = false;
                        }
                    }
                }
            }
        }

        if (player1Deck.length > player2Deck.length) {
            return 1; // Player 1 wins
        } else if (player2Deck.length > player1Deck.length) {
            return 2; // Player 2 wins
        } else {
            return 0; // Draw (or max turns reached)
        }
    }

    function simulateWarGames(numDecks, numGames) {
        let player1Wins = 0;
        let player2Wins = 0;
        let draws = 0;
        const allGameResults = [];

        for (let i = 0; i < numGames; i++) {
            const deck = createDeck(numDecks);
            const winner = playWar(deck);
            allGameResults.push(winner);

            if (winner === 1) {
                player1Wins++;
            } else if (winner === 2) {
                player2Wins++;
            } else {
                draws++;
            }
        }

        const resultsText = `Simulation Results (${numGames} games with ${numDecks} deck(s)):\n` +
                            `Player 1 Wins: ${player1Wins}\n` +
                            `Player 2 Wins: ${player2Wins}\n` +
                            `Draws: ${draws}`;

        resultsOutput.textContent = resultsText;
    }
});
