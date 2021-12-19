class gameClass{
    constructor(gameDiv){
        this.main = gameDiv;
        this.tileCountTotal = 16;
        this.game = [
            [1,2,3,4],
            [5,6,7,8],
            [9,10,11,12],
            [13,14,15,0],
        ];
        this.currentHole = [3,3];
        this.locations = {};
        for(var i = 0; i < 16; i++){
 
            this.locations[i] = {
                x : 0,
                y : 0,
            };

        }
    }

    createTile(num){
        let tempTile = document.createElement("div");
        tempTile.className = "tile";
        tempTile.id = "tile" + num;
        tempTile.innerText = num;
        return tempTile;
    } 


    move(dir){
        if(dir == 3){
            let holeAbove = [this.currentHole[0] - 1,this.currentHole[1]];
            console.log(holeAbove);

            let holeAboveDOM = document.getElementById(`tile${this.game[holeAbove[0]][holeAbove[1]]}`);
            let holeDOM = document.getElementById(`tile0`);

            let thisLoc = this.locations[this.game[holeAbove[0]][holeAbove[1]]];
            let thisHoleLoc = this.locations[this.game[this.currentHole[0]][this.currentHole[1]]];

            thisHoleLoc.y -= 70;

            thisLoc.y += 70;
            holeAboveDOM.style.transform = `translate(${thisLoc.x}px,${thisLoc.y}px)`;
            holeDOM.style.transform = `translate(${thisHoleLoc.x}px,${thisHoleLoc.y}px)`;

            let tempNum = this.game[holeAbove[0]][holeAbove[1]];

            this.game[holeAbove[0]][holeAbove[1]] = this.game[this.currentHole[0]][this.currentHole[1]];

            this.game[this.currentHole[0]][this.currentHole[1]] = tempNum;

            this.currentHole[0] -= 1;
        }
    }


    initialise(){
        for(var i = 0; i < 4; i++){
            let tempColumn = document.createElement("div");
            tempColumn.className = "game_column";
            for(var j = 0; j < 4; j++){
                console.log(i,j);
                tempColumn.append(this.createTile(this.game[i][j]));
            }
            console.log(this.tileCountTotal);
            this.main.append(tempColumn);
        }
    }
}
var game;
window.onload = function(){
    var game_div = document.getElementById("game_main");
    game = new gameClass(game_div);
    game.initialise();
};
