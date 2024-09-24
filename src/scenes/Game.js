

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image("ball", "./public/assets/bola.png");
        this.load.image("paddle", "./public/assets/brick.png");
        this.load.image("blocks", "./public/assets/brick.png");
    }

    create() {
        console.log(this); // Verificar el contexto

        this.paddle = this.physics.add.image(400, 550, "paddle");
        this.paddle.setImmovable().setSize(700).setScale(0.2)
        this.ball = this.physics.add.sprite(400, 500, 'ball').setSize(900).setScale(0.04);
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);

        this.blocksGroup = this.physics.add.group(); // Inicializa el grupo de bloques

        for (let i = 0; i < 5; i++) {
            const block = this.blocksGroup.create(400 + (i * 100), 100, 'blocks').setImmovable().setSize(700).setScale(0.2);
            block.setData('hits', Math.floor(Math.random() * 3) + 1);
        }

        this.physics.add.collider(this.ball, this.blocksGroup, this.hitBlock, null, this);
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
        
        this.input.on('pointermove', (pointer) => {
            this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 990);
        });

        this.input.on('pointerup', () => {
            if (this.ball.getData('onPaddle')) {
                this.ball.setVelocity(-75, -300);
                this.ball.setData('onPaddle', false);
            }
        });

        this.ball.setData('onPaddle', true);
    }

    update() {
        if (this.ball.y > 600) {
            this.ball.setPosition(this.paddle.x, 400);
            this.ball.setVelocity(200);
            this.ball.setData('onPaddle', true);
        }
    }

    hitBlock(ball, block) {
        let hits = block.getData('hits');
        hits--;
        block.setData('hits', hits);
    
        // Cambia el tono del bloque cada vez que recibe un golpe
        let tint = 0xff0000; // Color de tinte inicial (rojo en este caso)
        let tintAmount = Math.floor((3 - hits) * (0x555555)); // Cada golpe oscurece el bloque más
        block.setTint(tint ^ tintAmount); // Aplica el tinte
    
        if (hits <= 0) {
            block.disableBody(true, true);
        }
    }
    

    hitPaddle(ball, paddle) {
        let diff = 0;

        if (ball.x < paddle.x) {
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        } else if (ball.x > paddle.x) {
            diff = ball.x - paddle.x;
            ball.setVelocityX(10 * diff);
        } else {
            ball.setVelocityX(2 + Math.random() * 8);
        }
    }
}
