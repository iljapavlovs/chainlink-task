// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
//Interfaces define functions without their implementation, which leaves inheriting contracts to define the actual implementation themselves.
//In this case, AggregatorV3Interface defines that all v3 Aggregators have the function latestRoundData
// !!!! need to `npm install @chainlink/contracts --save`
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */
//    The constructor() {} initializes an interface object named priceFeed that uses AggregatorV3Interface
//and connects specifically to a proxy aggregator contract that is already deployed at 0x9326BFA02ADD2366b30bacB125260Af641031331.
//The interface allows your contract to run functions on that deployed aggregator contract.
    constructor() {
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    }

    /**
     * Returns the latest price

     1. When you deploy the contract, it initializes the priceFeed object to point to the aggregator at 0x9326BFA02ADD2366b30bacB125260Af641031331,
      which is the proxy address for the Kovan ETH / USD data feed.
     2. Your contract connects to that address and executes the function.
     3. !!!!!! The aggregator connects with several oracle nodes and aggregates the pricing data from those nodes.
     4. The response from the aggregator includes several variables, but getLatestPrice() returns only the price variable.
     */

    function getLatestPrice() public view returns (int) {
        // MY - ONLY GET WHAT IS NEEDED - like Object Destruction in JS
        (
        /*uint80 roundID*/,
        int price,
        /*uint startedAt*/,
        /*uint timeStamp*/,
        /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }
}