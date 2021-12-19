class gameClass{
    constructor(gameDiv){
        this.main = gameDiv;
        this.tileCountTotal = 10;
        this.game = [];

        for(var i = 0; i < this.tileCountTotal; i++){
            this.game.push([]);
            for(var j = 0; j < this.tileCountTotal; j++){
                this.game[this.game.length - 1][j] = i*this.tileCountTotal + j + 1; 
            }
        }

        this.game[this.tileCountTotal - 1][this.tileCountTotal - 1] = 0;
        this.currentHole = [this.tileCountTotal - 1, this.tileCountTotal - 1];
        this.locations = {};
        for(var i = 0; i < this.tileCountTotal*this.tileCountTotal; i++){
 
            this.locations[i] = {
                x : 0,
                y : 0,
            };

        }
    }

    createTile(num){
        let tempTile = document.createElement("div");
        if(num == 0){
            tempTile.style.opacity = 0;
        }
        tempTile.className = "tile";
        tempTile.id = "tile" + num;
        tempTile.innerText = num;
        return tempTile;
    } 


    move(dir){
        let xOffset = 0, yOffset = 0;
        if(dir == 3){
            yOffset = -1;
        }else if(dir == 1){
            yOffset = 1;
        }else if(dir == 4){
            xOffset = -1;
        }else if(dir == 2){
            xOffset = 1;
        }
        
        if((this.currentHole[0] + yOffset) >= (this.tileCountTotal) || (this.currentHole[1] + xOffset) >= (this.tileCountTotal) || (this.currentHole[1] + xOffset) < 0 || (this.currentHole[0] + yOffset) < 0){
            return;
        }

        let holeAbove = [this.currentHole[0] + yOffset,this.currentHole[1] + xOffset];

        let holeAboveDOM = document.getElementById(`tile${this.game[holeAbove[0]][holeAbove[1]]}`);
        let holeDOM = document.getElementById(`tile0`);

        let thisLoc = this.locations[this.game[holeAbove[0]][holeAbove[1]]];
        let thisHoleLoc = this.locations[this.game[this.currentHole[0]][this.currentHole[1]]];

        if(yOffset != 0){
            thisHoleLoc.y += 70*yOffset;
            thisLoc.y += -70*yOffset;
        }else if(xOffset != 0){
            thisHoleLoc.x += 60*xOffset;
            thisLoc.x += -60*xOffset;                
        }


        holeAboveDOM.style.transform = `translate(${thisLoc.x}px,${thisLoc.y}px)`;
        holeDOM.style.transform = `translate(${thisHoleLoc.x}px,${thisHoleLoc.y}px)`;

        let tempNum = this.game[holeAbove[0]][holeAbove[1]];

        this.game[holeAbove[0]][holeAbove[1]] = this.game[this.currentHole[0]][this.currentHole[1]];

        this.game[this.currentHole[0]][this.currentHole[1]] = tempNum;

        if(yOffset != 0){

            this.currentHole[0] += yOffset;
        }else if(xOffset != 0){
            this.currentHole[1] += xOffset;

        }
        
    }


    initialise(){
        for(var i = 0; i < this.tileCountTotal; i++){
            let tempColumn = document.createElement("div");
            tempColumn.className = "game_column";
            for(var j = 0; j < this.tileCountTotal; j++){
                tempColumn.append(this.createTile(this.game[i][j]));
            }
            this.main.append(tempColumn);
        }

        var times = Math.floor(Math.random()*20) + 100;
        var last = 0;
        var random = [3,4];
        for(var i = 0; i < times; i++){
            var last = (Math.floor(Math.random()*100))%2;
            this.move(random[last]);
            
            if(random[last] == 3 || random[last] == 1){
                random = [4,2];
            }else if(random[last] == 2 || random[last] == 4){
                random = [1,3];
            }
        }
    }
}
var game;
window.onload = function(){
    var game_div = document.getElementById("game_main");
    game = new gameClass(game_div);
    game.initialise();
};

window.onkeydown = function(event){
    if(event.keyCode == 37){
        game.move(2)
    }

    if(event.keyCode == 38){
        game.move(1)
    }

    if(event.keyCode == 39){
        game.move(4)
    }

    if(event.keyCode == 40){
        game.move(3)
    }


};
