class gameClass{
    constructor(gameDiv, config){
        this.config = config;
        this.main = gameDiv;
        this.tileCountTotal = this.config.n;
        this.game = [];
        this.canMove = false;
        /// Setting up the initial game-array
        for(var i = 0; i < this.tileCountTotal; i++){
            this.game.push([]);
            for(var j = 0; j < this.tileCountTotal; j++){
                this.game[this.game.length - 1][j] = i*this.tileCountTotal + j + 1; 
            }
        }

        /// The hole's position is represented by a '0' and it's location is on the bottom-right
        this.game[this.tileCountTotal - 1][this.tileCountTotal - 1] = 0;
        this.currentHole = [this.tileCountTotal - 1, this.tileCountTotal - 1];

        /// the object 'locations' remembers the location of each tile and transltes them
        this.locations = {};
        for(var i = 0; i < this.tileCountTotal*this.tileCountTotal; i++){
            this.locations[i] = {
                x : 0,
                y : 0,
            };
        }
        var self = this;
        window.onresize = function(){
            if((window.innerWidth < ((this.config.size + 2*this.config.margin)*(this.config.n) + 20)) || window.innerWidth < 400 ){
                this.config.margin = 5;
                this.config.size = Math.floor(((window.innerWidth - 70)/this.config.n) - 2*this.config.margin );
            }
            console.log(this.config);

            self.reinitialise();
        };
    }

    /*
        Creates the tiles and returns the DIV
    */
    createTile(num){

        
        let tempTile = document.createElement("div");
        if(num == 0){
            tempTile.style.opacity = 0;
        }
        tempTile.className = "tile";

        /// Applying the style according to the config file provided

        tempTile.style.margin = `${this.config.margin}px`;
        tempTile.style.height = `${this.config.size}px`;
        tempTile.style.width = `${this.config.size}px`;

        tempTile.id = "tile" + num;
        tempTile.innerText = num;
        return tempTile;
    } 

    createTileShadow(){
        let tempTile = document.createElement("div");
        tempTile.className = "tileShadow";

        /// Applying the style according to the config file provided

        tempTile.style.margin = `${this.config.margin}px`;
        tempTile.style.height = `${this.config.size}px`;
        tempTile.style.width = `${this.config.size}px`;

        return tempTile;
    }

    move(dir, wonAlert = true){
        let xOffset = 0, yOffset = 0;

        /// dir 3 : top
        /// dir 1 : bottom
        /// dir 4 : left
        /// dir 2 : right

        if(dir == 3){
            yOffset = -1;
        }else if(dir == 1){
            yOffset = 1;
        }else if(dir == 4){
            xOffset = -1;
        }else if(dir == 2){
            xOffset = 1;
        }
        
        /// We don't wanna move if the the hold is on the edge
        if(!this.canMove && wonAlert){
            return -2;
        }
        else if((this.currentHole[0] + yOffset) >= (this.tileCountTotal) || (this.currentHole[1] + xOffset) >= (this.tileCountTotal) || (this.currentHole[1] + xOffset) < 0 || (this.currentHole[0] + yOffset) < 0){
            return -1;
        }

        /// Getting the coordinates of the hole adjacent, which is determined by the variable 'dir'
        let holeAbove = [this.currentHole[0] + yOffset,this.currentHole[1] + xOffset];

        let holeAboveDOM = document.getElementById(`tile${this.game[holeAbove[0]][holeAbove[1]]}`);
        let holeDOM = document.getElementById(`tile0`);

        /// Getting the location so we can translate it
        let thisLoc = this.locations[this.game[holeAbove[0]][holeAbove[1]]];
        let thisHoleLoc = this.locations[this.game[this.currentHole[0]][this.currentHole[1]]];
        

        if(yOffset != 0){
            thisHoleLoc.y += (this.config.size + this.config.margin*2 + 10)*yOffset;
            thisLoc.y += -(this.config.size + this.config.margin*2 + 10)*yOffset;
        }else if(xOffset != 0){
            thisHoleLoc.x += (this.config.size + this.config.margin*2)*xOffset;
            thisLoc.x += -(this.config.size + this.config.margin*2)*xOffset;                
        }

        /// Applying the translated positions
        holeAboveDOM.style.transform = `translate(${thisLoc.x}px,${thisLoc.y}px)`;
        holeDOM.style.transform = `translate(${thisHoleLoc.x}px,${thisHoleLoc.y}px)`;

        /// Swapping the numbers in the main game array
        let tempNum = this.game[holeAbove[0]][holeAbove[1]];
        this.game[holeAbove[0]][holeAbove[1]] = this.game[this.currentHole[0]][this.currentHole[1]];
        this.game[this.currentHole[0]][this.currentHole[1]] = tempNum;

        /// Changing the hole's position to its current location
        if(yOffset != 0){
            this.currentHole[0] += yOffset;
        }else if(xOffset != 0){
            this.currentHole[1] += xOffset;
        }

        let lastNum = -1;
        let won = -1;
        for(var i = 0; i < this.tileCountTotal; i++){
            for(var j = 0; j < this.tileCountTotal; j++){

                if(lastNum == -1){
                    lastNum = this.game[i][j];
                    continue;
                }   

                if((this.game[i][j] - lastNum) != 1 && this.game[i][j] != 0){
                    won = 0;
                    break;
                }else{
                    lastNum = this.game[i][j];
                }

                
            }

            if(won == 0){
                break;
            }
        }

        if(won == -1 && wonAlert){
            alert("You won!");
        }
        
    }

    reinitialise(){
        this.canMove = false;
        this.main.innerHTML = "";
        

        let shadowContainer = document.createElement("div");
        shadowContainer.id = "shadowCon";
        this.main.append(shadowContainer);

        let tilesContainer = document.createElement("div");
        tilesContainer.id = "tilesCon";
        this.main.append(tilesContainer);


        for(var i = 0; i < this.tileCountTotal; i++){
            let tempColumn = document.createElement("div");
            tempColumn.className = "game_column";
            for(var j = 0; j < this.tileCountTotal; j++){
                tempColumn.append(this.createTile(this.game[i][j]));
            }
            tilesContainer.append(tempColumn);

            let tempColumnShadow = document.createElement("div");
            tempColumnShadow.className = "game_column";
            for(var j = 0; j < this.tileCountTotal; j++){
                tempColumnShadow.append(this.createTileShadow());
            }
            shadowContainer.append(tempColumnShadow);
        }


        for(var i = 0; i < this.tileCountTotal*this.tileCountTotal; i++){
            this.locations[i] = {
                x : 0,
                y : 0,
            };
        }
        this.canMove = true;

    }

    initialise(){

        /// Appending the tiles in the main div
        let shadowContainer = document.createElement("div");
        shadowContainer.id = "shadowCon";
        this.main.append(shadowContainer);

        let tilesContainer = document.createElement("div");
        tilesContainer.id = "tilesCon";
        this.main.append(tilesContainer);


        for(var i = 0; i < this.tileCountTotal; i++){
            let tempColumn = document.createElement("div");
            tempColumn.className = "game_column";
            for(var j = 0; j < this.tileCountTotal; j++){
                tempColumn.append(this.createTile(this.game[i][j]));
            }
            tilesContainer.append(tempColumn);

            let tempColumnShadow = document.createElement("div");
            tempColumnShadow.className = "game_column";
            for(var j = 0; j < this.tileCountTotal; j++){
                tempColumnShadow.append(this.createTileShadow());
            }
            shadowContainer.append(tempColumnShadow);
        }
        
        /// The initial state of the game is determined by moving the tiles from the 
        /// original configuration; this will ensure that it is always possible for the user
        /// to use legal moves to go back to the original configuration to win the game
        var times = Math.floor(Math.random()*20) + 200;
        var last = 0;

        /// As the hole is initially at the bottom left, the first moves should be top or left
        var random = [3,4];
        for(var i = 0; i < times; i++){
            /// Choosing a random move to make
            var last = (Math.floor(Math.random()*100))%(random.length);
            let moved = random[last];

            /// If the move made does not affect the configration of the game, then try again 
            /// so hopefully we don't get the same move again. 
            if(this.move(moved, false) == -1){
                i--;
                continue;
            }
            
            /// The next random array should not undo what the last move did,
            /// so eliminating that possibility
            if(moved == 3 || moved == 1){
                random = [4,2,moved];
            }else if(moved == 2 || moved == 4){
                random = [1,3,moved];
            }

            /// If the hole is on the corner, don't make moves that would not change the conifguration at all
            if(this.currentHole[0] == 0 && this.currentHole[1] == 0){
                random = [1,2];
            }else if(this.currentHole[0] == 0 && this.currentHole[1] == (this.tileCountTotal - 1)){
                random = [1,4];
            }else if(this.currentHole[1] == 0 && this.currentHole[0] == (this.tileCountTotal - 1)){
                random = [3,2];
            }else if(this.currentHole[1] == (this.tileCountTotal - 1) && this.currentHole[0] == (this.tileCountTotal - 1)){
                random = [3,4];
            }

        }

        this.canMove = true;
    }


}
var game;
var config = {
    "margin" : 5,
    "size" : 70,
    "n" : 4,
};
window.onload = function(){
    var game_div = document.getElementById("game_main");
    console.log();
    if(window.innerWidth < ((config.size + 2*config.margin)*(config.n) + 20)){
        config.size = Math.floor(((window.innerWidth - 40)/config.n) - 2*config.margin );
    }
    game = new gameClass(game_div, config);
    game.initialise();

    window.onkeydown = function(event){
        if(event.keyCode == 37){
            game.move(2);
        }
    
        if(event.keyCode == 38){
            game.move(1);
        }
    
        if(event.keyCode == 39){
            game.move(4);
        }
    
        if(event.keyCode == 40){
            game.move(3);
        }
    };
    
    let touchStatus = {};
    window.addEventListener("touchstart",function(event){
        touchStatus.start = {};
        touchStatus.start.x = event.touches[0].screenX;
        touchStatus.start.y = event.touches[0].screenY;
    });


    window.addEventListener("touchend",function(event){
        let xDiff = event.changedTouches[0].screenX - touchStatus.start.x;
        let yDiff = event.changedTouches[0].screenY - touchStatus.start.y;

        if(Math.abs(xDiff) > Math.abs(yDiff)){
            if(Math.abs(xDiff) > 30){
                if(xDiff < 0){
                    game.move(2);

                }else{
                    game.move(4);

                }
            }
        }else{
            console.log(yDiff);
            if(Math.abs(yDiff) > 30){
                if(yDiff < 0){
                    game.move(1);
                    
                }else{
                    game.move(3);

                }
            }
        }
    });
    window.addEventListener("touchcancel",function(event){
        console.log(event.changedTouches);
    });
    
};

