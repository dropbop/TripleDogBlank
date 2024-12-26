document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code ...

    function playWar(deck) {
        let { player1Deck, player2Deck } = dealCards(shuffleDeck(deck));
        console.log("Player 1 Deck after dealing:", player1Deck); // ADDED
        console.log("Player 2 Deck after dealing:", player2Deck); // ADDED

        let turns = 0;
        const maxTurns = 10000;

        while (player1Deck.length > 0 && player2Deck.length > 0 && turns < maxTurns) {
            turns++;
            console.log("Player 1 Deck before shift:", player1Deck); // ADDED
            console.log("Player 2 Deck before shift:", player2Deck); // ADDED

            if (!Array.isArray(player1Deck)) { // ADDED
                console.error("player1Deck is not an array:", player1Deck);
                return; // Stop execution to avoid further errors
            }
            if (!Array.isArray(player2Deck)) { // ADDED
                console.error("player2Deck is not an array:", player2Deck);
                return; // Stop execution to avoid further errors
            }

            const card1 = player1Deck.shift(); // Line 65
            const card2 = player2Deck.shift(); // Line 66

            console.log("Card 1:", card1); // ADDED
            console.log("Card 2:", card2); // ADDED

            // ... rest of the function ...
        }
        // ...
    }

    // ... your existing code ...
});
