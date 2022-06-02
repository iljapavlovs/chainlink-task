# Data Feed Architecture

## Data Feed Overview

When you connect a smart contract to real-world services or off-chain data, you create a **_hybrid smart contract_**. 
For example, you can use Chainlink Data Feeds to connect your smart contracts to asset pricing data like the ETH / USD feed.
* **These data feeds use the data aggregated from many independent Chainlink node operators**. 
* **Each price feed has an on-chain address and functions that enable contracts to read pricing data from that address**.


## Data Aggregation for Data Feed
Each data feed is updated by multiple, independent Chainlink oracle operators. 
Off-Chain Reporting (OCR) further enhances the aggregation process


### Data Aggregation Process Overview
![DataFeedArchitecture](images/DataFeedArchitecture.png)

1. A Consumer contract is any contract that uses Chainlink Data Feeds to consume aggregated data.
2. Proxy contracts are on-chain proxies that point to the aggregator for a particular data feed. 
Using proxies enables the underlying aggregator to be upgraded without any service interruption to consuming contracts.
3. An aggregator is the contract that receives periodic data updates from the oracle network via OCR protocol.
Update happens when the **_Deviation Threshold_** or **_Heartbeat Threshold_** triggers an update during an aggregation round. 
The first condition that is met triggers an update to the data.

**Main points**:
* Each data feed is updated by a decentralized oracle network
* Each oracle operator is rewarded for publishing data
* In order for an update to take place, the data feed aggregator contract must receive responses from a minimum number
  of oracles or the latest answer will not be updated
* Each oracle in the set publishes data during an aggregation round
* That data is validated and aggregated by a smart contract, which forms the feed's latest and trusted answer


### OCR Protocol Overview
> Sources:
> * [Chainlink Off-chain Reporting Protocol](https://research.chain.link/ocr.pdf?_ga=2.256976907.1641570120.1653852251-871476263.1653137801)
> * [Off-Chain Reporting](https://docs.chain.link/docs/off-chain-reporting/)
> * [Chainlink 2.0: Next Steps in the Evolution of Decentralized Oracle Networks](https://research.chain.link/whitepaper-v2.pdf?_ga=2.151252153.1641570120.1653852251-871476263.1653137801)

For Off-Chain Reporting aggregators, all nodes communicate using a peer to peer network

High-level Process overview:
1. During the communication process, a lightweight consensus algorithm runs where each node reports its data observation and signs it.
2. A single aggregate transaction is then transmitted, which saves a significant amount of gas.
3. The report contained in the aggregate transaction is signed by a quorum of oracles and contains all oracles' observations 

By validating the report on-chain and checking the quorum's signatures on-chain, we preserve the trustlessness properties of Chainlink oracle networks.


**Benefits**:
* Overall network congestion from Chainlink oracle networks is reduced dramatically
* Individual node operators spend far less on gas costs
* Node networks are more scalable because data feeds can accommodate more nodes
* Data feeds can be updated in a more timely manner since each round needn't wait for 
multiple transactions to be confirmed before a price is confirmed on-chain.

More Low-level Overview:
1. The nodes regularly elect new Leader Node that drives the rest of the protocol
2. The Leader Node regularly requests followers (other nodes) to provide freshly signed observations and aggregates them into a report
3. The Leader Node sends this report back to the followers and asks them to verify the report's validity
4. Quorum of followers approves the report by sending a signed copy back to the leader
5. The Leader Node assembles a final report with the quorum's signatures and broadcasts it to all followers
6. The nodes attempt to transmit the final report to the _Aggregator Contract_ according to a randomized schedule
7. The _Aggregator Contract_ verifies that a quorum of nodes signed the report 
8. The _Aggregator Contract_ pays each oracle that contributed an observation to the report and exposes the median value to consumers as an answer with a block timestamp and a round ID
9. The first transmitter to successfully transmit the report to C is paid extra to make up for the Ethereum transaction fees she incurred during transmission of the report
10. All nodes watch the blockchain for the final report to remove any single point of failure during transmission.
If the designated node fails to get their transmission confirmed within a determined period,
a round-robin protocol kicks in so other nodes can also transmit the final report until one of them is confirmed.

One of the things that OCR protocol tries to achieve is to solve Byzantine Fault Tolerance  problem, meaning to achieve fault-tolerant computer system 
to a condition when nodes may fail and there is imperfect information on whether a component has failed (in order to avoid catastrophic failure of the system, 
the system's actors must agree on a concerted strategy (reach consensus), but some of these actors are unreliable.)

#### OCR Protocol Design Goals
* **Resilience**: The protocol should be resilient to different kinds of failures. Oracles may become Byzantine out
of malice or due to buggy code. The chosen security model limits only the number of faulty oracles, not
the types of faults.
* **Simplicity**: We will implement and maintain this design, and wish to ship quickly to meet growing market
demand, while supporting continual future improvements. We thus follow the KISS principle (“keep it
simple, stupid”) and try to make choices that lend themselves to straightforward implementation, reducing the likelihood of defects in the final system.
* **Low transaction fees**: Communication between the oracles and computation performed by the oracles happens off-chain and is therefore (almost) free. 
In contrast, communication with smart contract requires Ethereum
transactions which carry hefty fees; for example, assuming a gas price of 30 GWei and an ETH price of
USD 200 as of 2020, a transaction requiring 100k gas costs around 60 cents. In times of network congestion 
(e.g. caused by volatile markets), these fees could climb tenfold to USD 6 per transaction! We
thus aim to minimize transaction fees, even if this results in protocol with higher off-chain computation
and networking requirements.
* **Low latency**: We want to minimize the time between the initiation of the signing protocol and the inclusion of
the resulting transaction on the blockchain by C. Most end users of the data posted to C are DeFi trading
platforms — they need fresh data. The performance of the data gathering protocol should only be limited
by the network transmission latency (the network capacity seems of low relevance because the amount of
transmitted data is small). Assuming real-world internet latencies, the protocol should produce a report
within a few seconds. Typically, this time will be dominated by the time it takes to complete transmission
of the resulting report to C. For example, in the case of Ethereum, we have to conservatively assume that
inclusion of the transmission transaction may take on the order of minutes. However, on next-generation
blockchains, inclusion may take less than second.

# Risks

* Security (BFT) - how to trust a node, signing, 
  * Trust-minimization - Creating a highly trustworthy layer of support for
    smart contracts and other oracle-dependent systems by means of decentralization, strong anchoring in high-security blockchains, cryptographic
    techniques, and cryptoeconomic guarantees.
  * Incentive-based (cryptoeconomic) security: Rigorously designing and robustly deploying mechanisms that ensure nodes 
  in DONs have strong economic incentives to behave reliably and correctly, even in the face of wellresourced adversaries
* Scalability - Ensuring that oracle services achieve the latencies and throughputs
  demanded by high-performance decentralized systems.

* All-or-nothing off-chain report broadcast: OCR ensures that an attested report
     is made quickly available to all honest nodes or none of them. This is a fairness
     property that helps ensure that honest nodes have an opportunity to participate
     in attested report transmission.
* Reliable transmission: OCR ensures, even in the presence of faulty or malicious
   nodes, that all OCR reports and messages are transmitted to SC within a certain,
   pre-defined interval of time. This is a liveness property. 
* Contract-based trust minimization: SC filters out potentially erroneous OCRgenerated reports, e.g., if their reported values deviate significantly from other
   recently received ones. This is a form of extra-protocol correctness enforcement.

CWhy consesus is needed in Blockchain? - in order to overcome Byzantine Problem - 
* It's an automated process to ensure that there exists only one single valid copy of record shared by all the nodes
* use to validate the authenticity of transactions and maintain the security of the underlying blockchain. 
* This system ensures that all legitimate transactions are recorded on the blockchain 
and that each copy of the blockchain contains all valid transactions


* Pacemaker Protocol
  * drives the report generation process, which is structured into epochs
  * In each epoch, there is a designated leader that drives a report generation protocol for the epoch
  * does not ensure consensus and relies on smart contract for resolving ambiguities that may occur due to transitions across epochs
  * runs continuously periodically initiates a new epoch and a corresponding instance of the report generation protocol.
  * Every report generation instance has a designated leader (The pacemaker protocol emits a _startepoch_ event that triggers the leader to start the report generation protocol)
  * The pacemaker may also abort the currently running report generation instance if it does not observe enough progress
  * BFT solution 
    1. the pacemaker protocol receives _progress_ events from the current report generation instance. 
    2. Every oracle runs a timer with timeout duration _∆progress_ that serves to watch the epoch leader’s performance; every _progress_ event resets that timer. 
    3. When the timer expires, the oracle concludes that the current leader was not performing correctly and has not produced a valid report that may be sent to C. 
    4. The oracle then moves to initiate a new epoch with another report generation protocol instance and a different leader.
  * Changing Leader process:
    * The pacemaker protocol also responds to _changeleader_ events originating from a report generation instance.
      This event indicates that the instance and its leader have run for the maximum permitted duration and that its
      epoch ends. When this occurs, the pacemaker also aborts the current report generation instance and starts the
      next epoch, with a new report-generation instance and possibly a different leader.

* Report generation
  * Every report generation protocol instance corresponds to an epoch
  * A new epoch should be started whenever a sufficient number of oracles have
    determined that a new leader is needed
  * The report generation protocol of an epoch is structured into **_rounds_**
  * The report generation protocol of an epoch is structured into rounds.
    In each round, the protocol gathers observations and, if conditions for going forward are met, it generates a
    signed oracle report, which it hands over to the transmission protocol for transmission to C.
  So does this mean that round - is when a new report is generated collected from oracles?
  * The rounds are controlled by the leader itself and by a timeout ∆round. This timeout, which is only triggered
    by the leader, controls the frequency of rounds and of gathering observations. The value of ∆round must be lower
    than ∆progress and larger than the network latency required to complete a full iteration of the report generation
    protocol during periods of synchrony, plus a safety margin.
    
  * Once a sufficient number of observations are collected together into the more compact form of a report, the
     report is ready for being sent to C through the transmission protocol. The report contains enough signatures
     of the oracles for C to verify that the report is correct and valid.
  * Preventing unnecessary reports :

* Transmission:
  * the transmission protocol does not involve any communication
    among the oracles
  * The transmission protocol delays oracles pseudo-randomly to ensure a staged sending
     process?
  * 

