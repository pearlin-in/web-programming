// Fund management object
const fundManager = {
    funds: {
        emergency: { name: 'Emergency Fund', current: 0, target: 10000, icon: '🚨', isDefault: true },
        retirement: { name: 'Retirement Fund', current: 0, target: 500000, icon: '🏖️', isDefault: true }
    },
    customFundCounter: 0,

    addFund: function(name, target) {
        const id = 'custom_' + (++this.customFundCounter);
        this.funds[id] = {
            name: name,
            current: 0,
            target: parseFloat(target),
            isDefault: false
        };
        this.saveFunds();
        return id;
    },

    deleteFund: function(id) {
        if (this.funds[id] && !this.funds[id].isDefault) {
            delete this.funds[id];
            this.saveFunds();
            return true;
        }
        return false;
    },

    addMoney: function(id, amount) {
        if (this.funds[id]) {
            this.funds[id].current += parseFloat(amount);
            // Prevent negative balance
            if (this.funds[id].current < 0) {
                this.funds[id].current = 0;
            }
            this.saveFunds();
            return true;
        }
        return false;
    },

    updateTarget: function(id, target) {
        if (this.funds[id]) {
            this.funds[id].target = parseFloat(target);
            this.saveFunds();
            return true;
        }
        return false;
    },

    getProgress: function(id) {
        if (this.funds[id]) {
            const fund = this.funds[id];
            return Math.min((fund.current / fund.target) * 100, 100);
        }
        return 0;
    },

    getTotalStats: function() {
        let totalCurrent = 0;
        let totalTarget = 0;
        let fundCount = Object.keys(this.funds).length;

        Object.values(this.funds).forEach(fund => {
            totalCurrent += fund.current;
            totalTarget += fund.target;
        });

        return {
            fundCount,
            totalCurrent,
            totalTarget,
            overallProgress: totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0
        };
    },

    saveFunds: function() {
        const data = JSON.stringify(this.funds);
        document.cookie = 'savingsFunds=' + data + '; max-age=31536000';
    },

    loadFunds: function() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'savingsFunds') {
                try {
                    this.funds = JSON.parse(value);
                    const customIds = Object.keys(this.funds).filter(id => id.startsWith('custom_'));
                    if (customIds.length > 0) {
                        const maxId = Math.max(...customIds.map(id => parseInt(id.split('_')[1])));
                        this.customFundCounter = maxId;
                    }
                } catch (e) {
                    console.error('Error loading funds:', e);
                }
                break;
            }
        }
    },

    clearAll: function() {
        this.funds = {
            emergency: { name: 'Emergency Fund', current: 0, target: 10000, isDefault: true },
            retirement: { name: 'Retirement Fund', current: 0, target: 500000, isDefault: true }
        };
        this.customFundCounter = 0;
        this.saveFunds();
    }
};

// Initialise
fundManager.loadFunds();

let currentFundId = null;

function showPage(pageId) {
    $('.page').removeClass('active');
    $('#' + pageId).addClass('active').hide().fadeIn(300);
}

function showMain() {
    renderFunds();
    showPage('mainPage');
}

function showAddFund() {
    // Clear previous input values
    $('#fundName').val('');
    $('#targetAmount').val('');

    showPage('addFundPage');
}

function showFundDetails(fundId) {
    currentFundId = fundId;
    const fund = fundManager.funds[fundId];
    
    $('#detailFundNameTitle').text((fund.icon ? fund.icon + ' ' : '') + fund.name);
    $('#detailTargetAmount').val(fund.target);
    $('#detailCurrentAmount').val('$' + fund.current.toLocaleString());
    $('#adjustMoneyAmount').val('');
    
    const progress = fundManager.getProgress(fundId);
    $('#detailProgressFill').css('width', progress + '%');
    $('#detailProgressText').text(Math.round(progress) + '% Complete');
    
    if (fund.isDefault) {
        $('#deleteFundBtn').hide();
    } else {
        $('#deleteFundBtn').show();
    }
    
    showPage('fundDetailsPage');
}

function renderFunds() {
    const grid = $('#fundsGrid');
    grid.empty();

    Object.keys(fundManager.funds).forEach(id => {
        const fund = fundManager.funds[id];
        const progress = fundManager.getProgress(id);
        const cardClass = fund.isDefault ? 'default' : 'custom';
        
        const card = $(`
            <div class="fund-card ${cardClass}" onclick="showFundDetails('${id}')">
                <div class="fund-header">
                    <span class="fund-name">${fund.icon ? fund.icon + ' ' : ''}${fund.name}</span>
                </div>
                <div class="fund-amounts">
                    <div class="amount-row">
                        <span>Current:</span>
                        <span>$${fund.current.toLocaleString()}</span>
                    </div>
                    <div class="amount-row">
                        <span>Target:</span>
                        <span>$${fund.target.toLocaleString()}</span>
                    </div>
                </div>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">${Math.round(progress)}% Complete</div>
                </div>
            </div>
        `);

        grid.append(card);
    });
}

renderFunds();

$('#addFundForm').on('submit', function(e) {
    e.preventDefault();
    const name = $('#fundName').val();
    const target = $('#targetAmount').val();
    fundManager.addFund(name, target);
    showMain();
});

function updateFund() {
    const fund = fundManager.funds[currentFundId];
    const newTarget = parseFloat($('#detailTargetAmount').val());
    const adjustAmount = parseFloat($('#adjustMoneyAmount').val());

    // Adjust money (positive = add, negative = subtract)
    if (!isNaN(adjustAmount) && adjustAmount !== 0) {
        fundManager.addMoney(currentFundId, adjustAmount);
    }
    
    // Update target
    if (!isNaN(newTarget) && newTarget > 0 && newTarget !== fund.target) {
        fundManager.updateTarget(currentFundId, newTarget);
    }

    showMain();
}

function deleteFund() {
    if (confirm('Are you sure you want to delete this fund?')) {
        if (fundManager.deleteFund(currentFundId)) {
            showMain();
        }
    }
}