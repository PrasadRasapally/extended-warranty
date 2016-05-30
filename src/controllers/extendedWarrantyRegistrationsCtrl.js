export default class ExtendedWarrantyRegistrationsCtrl {

    constructor(
        $scope
    ){
        this.registrations = [
            {
                registrationId: 101,
                facility: "facility - 1",
                salesRep: "Prasad Rasapally",
                installDate: "01/01/2010",
                registrationDate: "01/01/2020"
            },{
                registrationId: 102,
                facility: "facility - 2",
                salesRep: "SalerRep - 1",
                installDate: "02/02/2010",
                registrationDate: "02/02/2020"
            },{
                registrationId: 103,
                facility: "facility - 3",
                salesRep: "SalerRep - 3",
                installDate: "03/03/2010",
                registrationDate: "03/03/2020"
            }
        ];
        this.currentPage = "registration";
    
        this.selectRecord = function(record){
            this.selectedRecord = record;
            this.selectedRecordId = record.registrationId;
        };
        
        this.setSelectedRecord = function(){
            localStorage.setItem('selectedRecord' , JSON.stringify(this.selectedRecord));
        }
    }
}

ExtendedWarrantyRegistrationsCtrl.$inject = [
    '$scope'
];
