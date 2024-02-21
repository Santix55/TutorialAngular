import { LoanPage } from "./LoanPage";

export const LOAN_DATA: LoanPage = {
    content : [
        {
            id: 1,
            client: {id:1, name: "Santi"},
            game: {id:1, title:"Juego 1", category:{id:1, name:"cat1"}, age:18, author:{id:1, name:"a1", nationality:"sp"}},
            startDate: new Date(2024,0,1),
            endDate: new Date(2024,0,31)
        }
    ],
    pageable : {
        pageSize: 5,
        pageNumber: 0,
        sort: [
            {property: "id", direction: "ASC"}
        ]
    },
    totalElements: 1
}