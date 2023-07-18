import { Component, OnDestroy } from '@angular/core';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

interface Cell {
  color: string;
}
enum Сolors {
  BLUE = 'blue',
  YELLOW = 'yellow',
  GREEN = 'green',
  RED = 'red'
}

@Component({
  selector: 'app-main-grid',
  templateUrl: './main-grid.component.html',
  styleUrls: ['./main-grid.component.scss']
})
export class MainGridComponent implements OnDestroy {
  grid: Cell[][] = [];
  isGameOver: boolean = false;
  dialogSubscribtion: Subscription = new Subscription();
  timeLimit: number = 1000;
  playerScore: number = 0;
  computerScore: number = 0;
  readonly nameOfPanel = 'game-dialog-container';

  constructor(private dialog: MatDialog) {
    this.createGrid();
  }


  initGame() {
    this.playerScore = 0;
    this.computerScore = 0;
    this.isGameOver = false;
    this.resetGrid();
    this.initTimeout();
  }

  createGrid() {
    for (let i = 0; i < 10; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < 10; j++) {
        row.push({ color: Сolors.BLUE });
      }
      this.grid.push(row);
    }
  }

  resetGrid() {
    for (let row of this.grid) {
      for (let cell of row) {
        cell.color = Сolors.BLUE;
      }
    }
  }

  cellClicked(cell: Cell) {
    if (cell.color === Сolors.YELLOW) {
      cell.color = Сolors.GREEN;
      this.playerScore++;
      this.checkScores();
    }
  }

  initTimeout() {
    let row = Math.floor(Math.random() * 10);
    let column = Math.floor(Math.random() * 10);
    this.grid[row][column].color = Сolors.YELLOW;

    setTimeout(() => {
      if (this.grid[row][column].color === Сolors.YELLOW) {
        this.grid[row][column].color = Сolors.RED;
        this.computerScore++;
        this.checkScores();
      }
    }, this.timeLimit);
  }

  checkScores() {
    if (this.playerScore === 10 || this.computerScore === 10) {
      this.isGameOver = true;
      const data = {
        playerScore: this.playerScore,
        computerScore: this.computerScore
      };
      const dialogRef = this.dialog.open(DialogWindowComponent, {
        data: data,
        panelClass: this.nameOfPanel
      });

      this.dialogSubscribtion = dialogRef.afterClosed().subscribe((resultString) => {
        if (resultString === 'restart') {
          this.initGame();
        } else {
          this.resetGrid();
        }
      });
    }
    else {
      this.initTimeout();
    }
  }

  ngOnDestroy() {
    this.dialogSubscribtion.unsubscribe();
  }
}
