// This file should contain the Asteroids game code.
// Example structure using Phaser:

function startGame() {
    // Create or append the canvas if necessary
    var canvasElement = document.createElement('canvas');
    canvasElement.id = 'gameCanvas';
    document.body.appendChild(canvasElement);

    // Directly initialize Phaser game using the new canvas
    var gameConfig = {
        type: Phaser.AUTO,
        width: 800, // Example dimensions
        height: 600,
        parent: 'gameCanvas', // Specify the canvas element ID
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
	
	
	var game = new Phaser.Game(gameConfig);
	
// Preload assets utilized by the engine
    function preload() {
		this.load.image('space', 'D:/Repositories/Github/AJGrim.github.io/Images/Space-Background.png');
		this.load.image('ship', 'D:/Repositories/Github/AJGrim.github.io/Images/ship-c1.png');
		this.load.image('asteroid', 'D:/Repositories/Github/AJGrim.github.io/Images/med-a.png');
	}
	
// Generate the scene for the engine
	
	var ship;
	var asteroids;
	
	function create() {
		
		if (this.textures.exists('space')) {
			console.log('Image loaded');
		} else {
			console.log('Image not loaded');
    }
		
		
		// Background
		this.add.image(400, 300, 'space');
	
		// Player ship
		ship = this.physics.add.sprite(400, 500, 'ship');
		ship.setCollideWorldBounds(true);

		// Asteroids group
		asteroids = this.physics.add.group({
			key: 'asteroid',
			repeat: 5,
			setXY: { x: 12, y: 30, stepX: 70 }
		});

		// Collision between the ship and asteroids
		this.physics.add.collider(ship, asteroids, hitAsteroid, null, this);
	}

// Protocal to update and read inputs to the engine
	
	function update() {
		cursors = this.input.keyboard.createCursorKeys();

		if (cursors.left.isDown) {
			ship.setVelocityX(-160);
		} else if (cursors.right.isDown) {
			ship.setVelocityX(160);
		} else {
			ship.setVelocityX(0);
		}

		if (cursors.up.isDown) {
			ship.setVelocityY(-160);
		} else if (cursors.down.isDown) {
			ship.setVelocityY(160);
		} else {
			ship.setVelocityY(0);
		}
	}

	function hitAsteroid (ship, asteroid) {
		this.physics.pause();
		ship.setTint(0xff0000);
		ship.anims.play('explode');
	}

    // Additional functions for game logic
};

startGame();

