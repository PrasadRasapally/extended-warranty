export default class ExtendedWarrantyReviewCtrl {

    constructor(
        $scope,
        $location
    ){
        this.selectRecord = JSON.parse(localStorage.getItem('selectedRecord'));
        this.purchaseOrder = localStorage.getItem('puschaseOrder');
        
        this.selectedProducts = [
            {
                serialNumber: 101,
                productDescription: "productDescription - 1",
                selectedTerm: "EW 3/1",
                selectedPrice: "$100"
            },{
                serialNumber: 102,
                productDescription: "productDescription - 2",
                selectedTerm: "EW 3/2",
                selectedPrice: "$200"
            },{
                serialNumber: 103,
                productDescription: "productDescription - 3",
                selectedTerm: "EW 3/3",
                selectedPrice: "$300"
            }
        ];
        
        this.totalPrice = "$400";
        this.discountPrice = "$100";
        this.afterDiscountPrice = "$300";
        this.appliedDiscountCoupon = "1111";
        this.SAPAccountNumber = "123456";
    }
}

ExtendedWarrantyReviewCtrl.$inject = [
    '$scope',
    '$location'
];
