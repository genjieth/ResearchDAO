// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

interface IERC20 {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
}

contract Gov {

    uint16 public session = 0;
    uint public fee = 100000000000000000000;
    uint8 public threshold = 10;
    uint8 public authorsRewards = 50;
    uint8 public votersRewards = 25;
    uint8 public DAOReserve = 100 - authorsRewards - votersRewards;
    uint public voteCost = 1000000000000000000;
    uint public rewardPool = 0;

    string[] public sessionHashes;
    address[] public sessionAuthors;
    uint16[] public sessionVotes;
    address[] public sessionVoters;
    mapping(uint16 => mapping(address => uint16[])) public Voters;

    mapping(uint16 => string[]) public proceedingsHashes;
    mapping(uint16 => address[]) public proceedingsAuthors;
    mapping(uint16 => uint16[]) public proceedingsVotes;

    mapping(address => uint) public stakedTokenForVotes;
    mapping (address => bool) public Wallets;

    address public owner;
    IERC20 public RDAO;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(address _governance) {
        owner = msg.sender;
        RDAO = IERC20(_governance);
    }

    function setWallet(address _wallet) private {
        Wallets[_wallet]=true;
    }

    function walletContains(address _wallet) private view returns (bool){
        return Wallets[_wallet];
    }

    function makeProceedings(string[] memory _selectedHashes, address[] memory _selectedAuthors, uint16[] memory _selectedVotes) onlyOwner public {

        proceedingsHashes[session] = _selectedHashes;
        proceedingsAuthors[session] = _selectedAuthors;
        proceedingsVotes[session] = _selectedVotes;

        uint256 acceptedPapersLength = _selectedHashes.length;
        uint256 totalSelectedVotes = reduce(_selectedVotes);
        uint256 totalVotes = reduce(sessionVotes);

        for (uint256 i=0; i < acceptedPapersLength; i++) {
            RDAO.transfer(_selectedAuthors[i], (_selectedVotes[i]*authorsRewards*rewardPool)/(totalSelectedVotes*100));
        }

        for (uint256 i=0; i < sessionVoters.length; i++){
            RDAO.transfer(sessionVoters[i], (reduce(Voters[session][sessionVoters[i]])*votersRewards*rewardPool)/(100*totalVotes) + (stakedTokenForVotes[sessionVoters[i]]));
        }

        getToNextSession();
    }

    function reduce(uint16[] memory arr) pure internal returns (uint32){
        uint32 result=0;
        
        for (uint16 i = 0; i < arr.length; i++) {
            result += arr[i];
        }
        
        return result;
    }   

    function getToNextSession() private {
        session++;
        rewardPool = 0;

        delete sessionHashes;
        delete sessionAuthors;
        delete sessionVotes;
        delete sessionVoters;

        for (uint i=0; i<sessionVoters.length; i++) {
            stakedTokenForVotes[sessionVoters[i]] = 0;
            Wallets[sessionVoters[i]] = false;
        }
    }

    function releaseFunds(uint256 _value) onlyOwner public {
        require(_value <= RDAO.balanceOf(address(this)));
        RDAO.transfer(owner, _value);
    }

    function vote(uint16 _index, uint16 _nbVotes) public {

        uint cost = priceVote(msg.sender, _nbVotes, _index);

        bool _success = RDAO.transferFrom(msg.sender, address(this), cost);
        require(_success);

        if (!walletContains(msg.sender)) {
            setWallet(msg.sender);
            sessionVoters.push(msg.sender);
        }
        
        sessionVotes[_index] += _nbVotes;
        stakedTokenForVotes[msg.sender] += cost;
        if (Voters[session][msg.sender].length > _index) {
            Voters[session][msg.sender][_index] += _nbVotes;
        } else {
            for (uint i=Voters[session][msg.sender].length ; i <= _index; i++){
                Voters[session][msg.sender].push(0);
            }
            Voters[session][msg.sender][_index] += _nbVotes;
        }
    }

    function priceVote(address _user, uint16 _nbVotes, uint16 _index) private view returns (uint) {
        if (Voters[session][_user].length > _index) {
            return (_nbVotes*(Voters[session][_user][_index] + 1) ** 2 + _nbVotes*(_nbVotes-1)*(Voters[session][_user][_index] + 1) + (_nbVotes-1)*_nbVotes*(2*_nbVotes-1)/6) * voteCost;
        } else {
            return (_nbVotes + _nbVotes*(_nbVotes-1) +( _nbVotes-1)*_nbVotes*(2*_nbVotes-1)/6) * voteCost;
        }
        
    }

    function setFee(uint _fee) onlyOwner public {
        require(_fee > 0);
        fee = _fee;
    }

    function setThreshold(uint8 _threshold) onlyOwner public {
        require(_threshold >= 0);
        require(_threshold <= 100);
        threshold = _threshold;
    }
    
    function setRewards(uint8 _authorsRewards, uint8 _votersRewards) onlyOwner public {
        require(_authorsRewards >= 0);
        require(_votersRewards >= 0);
        require(_authorsRewards + _votersRewards <= 100);
        authorsRewards = _authorsRewards;
        votersRewards = _votersRewards;
    }
    
    function setVoteCost(uint _voteCost) onlyOwner public {
        require(_voteCost > 0);
        voteCost = _voteCost;
    }

    function nbArticles() public view returns (uint) {
        return sessionHashes.length;
    }

    function nbArticlesProceedings(uint16 _session) public view returns (uint) {
        return proceedingsHashes[_session].length;
    }

    function getSessionHashes() public view returns (string[] memory) {
        return sessionHashes;
    }

    function getSessionAuthors() public view returns (address[] memory) {
        return sessionAuthors;
    }

    function getSessionVotes() public view returns (uint16[] memory) {
        return sessionVotes;
    }

    function getSessionVoters() public view returns (address[] memory) {
        return sessionVoters;
    }

    function getProceedingsHashes(uint16 _session) public view returns (string[] memory) {
        return proceedingsHashes[_session];
    }

    function getProceedingsAuthors(uint16 _session) public view returns (address[] memory) {
        return proceedingsAuthors[_session];
    }

    function getProceedingsVotes(uint16 _session) public view returns (uint16[] memory) {
        return proceedingsVotes[_session];
    }

    function getVoters(address _user) public view returns (uint16[] memory) {
        return Voters[session][_user];
    }

    function submitArticle(string memory _cid) public {

        uint256 balance = RDAO.balanceOf(msg.sender);
        require(fee <= balance, "Not enough tokens");

        bool _success = RDAO.transferFrom(msg.sender, address(this), fee);
        require(_success);

        rewardPool+=fee;
        sessionHashes.push(_cid);
        sessionAuthors.push(msg.sender);
        sessionVotes.push(0);
    }
}