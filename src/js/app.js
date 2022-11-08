
const App = {
    web3Provider: null, contracts: {},

    init: async function () {
        // Load pets.
        $.getJSON('../pets.json', function (data) {
            let petsRow = $('#petsRow');
            let petTemplate = $('#petTemplate');

            for (let i = 0; i < data.length; i++) {
                petTemplate.find('.panel-title').text(data[i].name);
                petTemplate.find('img').attr('src', data[i].picture);
                petTemplate.find('.pet-breed').text(data[i].breed);
                petTemplate.find('.pet-age').text(data[i].age);
                petTemplate.find('.pet-location').text(data[i].location);
                petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                petsRow.append(petTemplate.html());
            }
        });

        return await App.initWeb3();
    },

    initWeb3: async function () {
        if (typeof window.ethereum !== "undefined") {
            App.web3Provider = window.Web3.givenProvider;
        } else {
            App.web3Provider = new Web3.providers.WebsocketProvider('ws://localhost:7545');
        }

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('Adoption.json', data => {
            App.contracts.Adoption = TruffleContract(data);
            App.contracts.Adoption.setProvider(App.web3Provider);
            // 初始化领养标记
            return App.markAdopted();
        })

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-adopt', App.handleAdopt);
    },

    markAdopted: async () => {
        const instance = await App.contracts.Adoption.deployed();
        const adopters = await instance.getAdopters.call();
        for (let i = 0; i < adopters.length; i++) {
            if (adopters[i] !== "0x0000000000000000000000000000000000000000") {
                //    第i个被领养了
                $('.panel-pet').eq(i).find('button').text('success').attr('disabled', true);
            }
        }
    },

    handleAdopt: async (event) => {
        event.preventDefault();

        let petId = parseInt($(event.target).data('id'));

        // const accounts = await Web3.eth.getAccounts();
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const instance = await App.contracts.Adoption.deployed();
        await instance.adopt(petId, {from: accounts[0]});
        App.markAdopted();  // refresh list
    }

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
