import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Loan } from './model/Loan';
import { LOAN_DATA } from './model/mock-loans';
import { Pageable } from '../core/model/page/Pageable';
import { LoanPage } from './model/LoanPage';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LoanService {

    constructor(
        private http: HttpClient
    ) { }

    getLoans(pageable:Pageable,  gameId?: number, clientId?:number, date?: Date): Observable<LoanPage> {
        let body:any = {pageable: pageable};

        if(gameId !== undefined)
            body.idGame = gameId;

        if(clientId !== undefined)
            body.idClient = clientId;

        if(date !== undefined)
            body.date = date;

        return this.http.post<LoanPage>('http://localhost:8080/loan', body);
    }

    saveLoan(loan: Loan): Observable<void> {
        /*
        this.datepipe = new DatePipe('es');
        loan.startDate = new Date(this.datepipe.transform(loan.startDate, 'yyyy-MM-dd'));
        loan.endDate = new Date(this.datepipe.transform(loan.endDate, 'yyyy-MM-dd'));
        */
        loan.startDate.setDate(loan.startDate.getDate() +1) ;
        loan.endDate.setDate(loan.endDate.getDate() +1) ;
        return this.http.put<void>("http://localhost:8080/loan", loan);

    }

    deleteLoan(idLoan: number): Observable<void> {
        return this.http.delete<void>('http://localhost:8080/loan/'+idLoan);
    }

}
