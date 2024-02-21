import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/game/model/Game';
import { Client } from 'src/app/client/model/Client';
import { Loan } from '../model/Loan';
import { ClientService } from 'src/app/client/client.service';
import { LoanService } from '../loan.service';
import { GameService } from 'src/app/game/game.service';
import { MatDialog } from '@angular/material/dialog';
import { LoanEditComponent } from '../loan-edit/loan-edit.component';
import { PageEvent } from '@angular/material/paginator';
import { Pageable } from 'src/app/core/model/page/Pageable';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Dialog } from '@angular/cdk/dialog';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})

export class LoanListComponent implements OnInit {
  loans: Loan[];
  clients: Client[];
  games: Game[];
  filterDate: Date;
  filterGame: Game;
  filterClient: Client;

  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'game', 'client', 'start', 'end', 'action'];

  constructor(
    private loanService: LoanService,
    private gameService: GameService,
    private clientService: ClientService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(
      clients => this.clients = clients
    );

    this.gameService.getGames().subscribe(
      games => this.games = games
    );

    this.loadPage();
  }

  onCleanFilter(): void {
    this.filterDate = null;
    this.filterClient = null;
    this.filterGame = null;
  }

  onSearch(): void {
    let date = this.filterDate;
    let clientId = this.filterClient!=null ? this.filterClient.id : null;
    let gameId = this.filterGame!=null ? this.filterGame.id : null;

    let pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort:[{
        property:'id',
        direction:'ASC'
      }]
    }

    this.loanService.getLoans(pageable, gameId, clientId, date).subscribe(data =>{ 
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  createLoan() {
    const dialogRef = this.dialog.open(LoanEditComponent, {
      data:{}
    })

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }

  editLoan(loan: Loan) {
    const dialogRef = this.dialog.open(LoanEditComponent,{
      data: {loan:loan}
    });

    dialogRef.afterClosed().subscribe(result => this.onSearch());
  }

  deleteLoan(loan: Loan) {
    const dialogRef =  this.dialog.open(DialogConfirmationComponent,{
      data:{title:"Eliminar préstamo", description:"Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el autor?"}
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.loanService.deleteLoan(loan.id).subscribe(result =>  {
              this.ngOnInit();
          }); 
      }
    });
  }

  loadPage(event?: PageEvent) {
    let pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort:[{
        property:'id',
        direction:'ASC'
      }]
    }

    if(event!=null){
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }

    this.loanService.getLoans(pageable).subscribe(data=>{
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;

    })
  }
}
