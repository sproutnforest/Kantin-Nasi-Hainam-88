var app = angular.module('warung88', []);

app.controller('RekapPenjualController', function($scope, $http, $window, $filter, $interval) {
    $scope.role = localStorage.getItem('role');
    if($scope.role !== 'admin') {
        $window.location.href = './index.html';
    }
     const periodDays = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365
      };

      $scope.selectedPeriod = 'daily';
      $scope.rekapData = [];

      $scope.updateRekap = function() {
        $http.get("https://eb6415fb-0b14-4e52-919d-efdcc0eb5ab0-00-2j9jbuyxc3a4h.pike.replit.dev/api/datas/viewData").then(response => {
          const allData = response.data;
          console.log(allData);
          const now = new Date();
          const cutoff = new Date();
          cutoff.setDate(now.getDate() - periodDays[$scope.selectedPeriod]);

          const filtered = allData.filter(d => {
            const date = new Date(d.tanggal);
            return date >= cutoff && d.status === "selesai";
          });

          const countMap = {};
          filtered.forEach(order => {
            order.pesanan.forEach(([menu, jumlah]) => {
              if (!countMap[menu]) countMap[menu] = 0;
              countMap[menu] += jumlah;
            });
          });

          $scope.rekapData = Object.entries(countMap).map(([menu, jumlah]) => ({ menu, jumlah })).sort((a, b) => b.jumlah - a.jumlah);

        });
      };

      $scope.updateRekap(); 

      $scope.fetchPendingOrdersCount = function () {
        $http.get("https://eb6415fb-0b14-4e52-919d-efdcc0eb5ab0-00-2j9jbuyxc3a4h.pike.replit.dev/api/datas/orders/pending-count").then(function (response) {
            $scope.pendingOrdersCount = response.data.count;
        }).catch(function (error) {
            console.error("Failed to fetch pending orders count:", error);
        });
    };
    $scope.fetchPendingOrdersCount();
    $interval($scope.fetchPendingOrdersCount, 60000);

    $scope.logout = function () {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("cart"); 
      localStorage.removeItem("username");
      $window.location.href = "./index.html"; 
    };
});