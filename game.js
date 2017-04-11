/**
 * Prior to starting this game it is highly recomended that your follow the following
 * tutorial at : https://hourofcode.com/flap
 * 
 * Now that your a bit familiar with higher level understandings lets dive a bit deeper.
 * 
 * The following is a very simple flappy birds implementation with many "block quotes" similar
 * to the one you are currently reading that explain some content and ask you questions
 * regarding your ability to modify the content in a manner that suits you.
 * 
 * The comments along with this tutorial are meant to engage and display the power of
 * programing. It is not meant to teach you any javascript specifc features (javascript is
 * the programing language that is currently being used in this file) nor is it meant to teach
 * you programing over an hour. It is completely ok to not understand any of the code that
 * is written below (in fact I my self didn't know what any of it meant untill Junior year
 * in high school). Hope you have fun following along and that you would be interested
 * in continuing to learn more about programing or pursuing other STEM fields.
 * 
 * Here is a list of some useful websites to teach such content:
 * https://www.codecademy.com/
 * https://studio.code.org/
 * https://www.w3schools.com/
 * http://tutorialspoint.com/
 * 
 */
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game');

var mainState = {
    /**
     * preload function is used to setup the content needed for flappy birds.
     * As you'll see in a few lines down this function sets the background image
     * to be used along with the images for bird and pipes.
     */
    preload: function () {
        /*
         * Sets the background color to a shade of green.
         * To change the color change the hex value "D0FFC2" below
         * to your favorite color.
         * 
         * For help choosing a color hex value visit: http://www.color-hex.com/
         */
        game.stage.backgroundColor = '#D0FFC2';

        /*
         * The following two variables are the pictures for the bird and pipe.
         * Now that doesn't look like an image because the image has been converted to a
         * text string of type base64.
         * 
         * To see what those pictures look like visit the following site below
         * http://codebeautify.org/base64-to-image-converter
         * 
         * To see the bird copy the following string below
         * iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEXSvicAAABogyUZAAAAGUlEQVR4AWP4DwYHMOgHDEDASCN6lMYV7gChf3AJ/eB/pQAAAABJRU5ErkJggg==
         * 
         * To see the the pipe copy the following string below
         * iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEV0vy4AAADnrrHQAAAAGUlEQVR4AWP4DwYHMOgHDEDASCN6lMYV7gChf3AJ/eB/pQAAAABJRU5ErkJggg==
         */
        bird = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEXSvicAAABogyUZAAAAGUlEQVR4AWP4DwYHMOgHDEDASCN6lMYV7gChf3AJ/eB/pQAAAABJRU5ErkJggg==";
        pipe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEV0vy4AAADnrrHQAAAAGUlEQVR4AWP4DwYHMOgHDEDASCN6lMYV7gChf3AJ/eB/pQAAAABJRU5ErkJggg==";
        
        /**
         * Loads the bird and pipe images into the game.
         */
        game.load.image('bird', bird);
        game.load.image('pipe', pipe);
    },
    /**
     * create function is used to start a new game by setting certain values and parameters needed.
     * For this tutorial some portions are out of the scope of this lesson so will not be touched on.
     */
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');
	/**
	 * The timer event below is used to generate an event that goes off every 1500 miliseconds and that event generates the
	 * new set of pipes.
	 */
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);

        this.bird = this.game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;

        // New anchor position
        this.bird.anchor.setTo(-0.2, 0.5);
        
        /**
         * Currently we have some good progress on our flappy birds game, but
         * for any flappy birds game to be useful we have to create an "event" that
         * allows a player to interact with the bird. In this case we would like
         * to specify the way we want to interact with the bird which is by using the space bar.
         */
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        /**
         * After setting our spacebar as the key we want to use we would like to
         * make the bird jump when that key is pressed down.
         */
        spaceKey.onDown.add(this.jump, this);

        /**
         * Since its a new game we want to set our starting score. Currently
         * its set to a 100 can you change that to be 0?
         */
        this.score = 100;
        /**
         * We also want to display that score on the game board. Currently we have it
         * displayed at size 10px which is very small for me to see. Can you change the size
         * to be 30px ? Also I like my score to be in a different color. Can you
         * change the color from '#ffffff' to a different color?
         * 
         * For help choosing a color hex value visit: http://www.color-hex.com/
         */
        this.labelScore = this.game.add.text(20, 20, this.score, {font: "10px Arial", fill: "#ffffff"});

        // Add the jump sound
        /**
         * Currently this feature doesn't work. Which is completely normal. There
         * are many times where features in a project don't function as expected and
         * it is the developers job to figure out why and create a fix. This is beyond
         * the scope of this tutorial but is left to illustrate real world examples that
         * occur during development life cycle.
         */
        this.jumpSound = this.game.add.audio('jump');
    },
    update: function () {
        /**
         * Checks to see if the bird is inside the grid and if not restart the game.
         */
        if (this.bird.inWorld === false)
            this.restartGame();

        /**
         * In this line we are checking to see if the bird and pipes are overlapping
         * meaning that the bird has hit the pipe and if so we call the "this.hitPipe"
         * function which ends the game.
         */
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

        // Rotate the bird    
        if (this.bird.angle < 20)
            this.bird.angle += 1;
    },
    /**
     * Simple function designed to allow the bird to jump. Gets called in the
     * create function spacekey event.
     */
    jump: function () {
        // If the bird is dead, he can't jump
        if (this.bird.alive === false)
            return;

        this.bird.body.velocity.y = -350;

        // Jump animation
        game.add.tween(this.bird).to({angle: -20}, 100).start();
    },
    hitPipe: function () {
        // If the bird has already hit a pipe, we have nothing to do
        if (this.bird.alive === false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        this.game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function (p) {
            p.body.velocity.x = 0;
        }, this);
    },
    restartGame: function () {
        game.state.start('main');
    },
    addOnePipe: function (x, y) {
        var pipe = this.pipes.getFirstDead();

        pipe.reset(x, y);
        pipe.body.velocity.x = -200;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function () {
        /**
         * Generate a random number between 1-6
         */
        var hole = Math.floor(Math.random() * 5) + 1;

        /**
         * Use the randomly generated number provided above to create a hole for
         * the bird to be able to fly through it.
         * Can you make this hole only be 1 square opening rather than 2?
         * Now can you please switch it back because 1 square opening is too hard :) ?
         */
        for (var i = 0; i < 8; i++) {
            if (i !== hole && i !== hole + 1) {
                this.addOnePipe(400, i * 60 + 10);
            }
        }

        /**
         * Updates the score by 1 and displays it on the text area.
         * Can you change the score value to update score by 5 ?
         */
	this.labelScore.text = this.score;
        this.score += 1;
    },
};

game.state.add('main', mainState);
game.state.start('main'); 

/**
 * And thats it you now have created your own simple flappy birds game to play on the web.
 * Hope you enjoyed this tutorial and that you would continue advancing your programing skills!
 */
