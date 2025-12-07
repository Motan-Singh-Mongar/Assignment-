Task 1: Multi-Component System Design (25 points) 
 
  Scenario: You need to explain the three-component architecture of this trading system to a new team member. 
 
  Part A (10 points): Describe the role and responsibilities of each component: 
•	RL-Enhanced Trading Bot 
•	Chart Analysis Bot 
•	Web Dashboard 

Solution:
1.	RL-Enhanced Trading Bot
-This type of AI applies reinforcement learning (a learning algorithm that learns through trial and error) to determine when to purchase, sell, or retain cryptocurrencies. It becomes better as time passes through learning profitable and losing trades.

RESPONSIBILITIES:

•	Get signals (weighted multi-indicator and/or recommendations of Chart Analysis/OpenAI).
•	Take action, Q-table or function approximator based on Q-table.
•	
•	Use intelligent position management principles (e.g. close all positions whose PnL goes bad, keep all profitable positions, opposite-signal management PnL conscious).
•	Replay and offline training Log trades, rewards, and experience.
•	Interact with exchange (Binance API), database and others.
It improves over time by learning through experience (though profitability and losing trades).
2.	Chart Analysis Bot 
-This bot is based on analyzing price charts by applying technical indicators (such as MACD and RSI) and artificial intelligence (OpenAI GPT-4o). It generates trading recommendations using chart pattern and market trends.
technical indicators 	Full Form	Function in the Bot
MACD	Moving Average Convergence Divergence	MACD is a trend following indicator of momentum that an asset displays the correlation between two different moving averages of the price. Its primary aim is to draw what is happening in the direction, intensity and pace of a price trend.
VWAP	Volume-Weighted Average Price	The average price of an asset, adjusted for its trading volume throughout the day. The bot uses it as a benchmark to assess whether the current price is considered a good value (below VWAP) or poor value (above VWAP).
EMAs	Exponential Moving Averages	A type of moving average that gives more weight to the most recent price data. Different periods (e.g., 9-day, 21-day) are used to analyze short-term, medium-term, and long-term trends.
RSI	Relative Strength Index	The RSI is a momentum oscillator which determines the pace and the direction of the price movement. It is ranked between 0 and 100, and is mainly applied in order to determine overbought or oversold situation.
ATR	Average True Range	A measure of market volatility. The bot uses ATR primarily for setting stop-loss and take-profit levels, ensuring trades adjust to the current market risk.



RESPONSIBILITIES:
•	It provides trading recommendation based on chart patterns and market trends.
•	Pull OHLCV (and tick) data on Binance at a timely rate.
•	Calculate indicators (MACD, VWAP, different EMAs, RSI, ATR etc.).
•	uses OpenAI (GPT-4o / analysis model) to make textual market commentary, risk awareness, and trade recommendation.
•	Fills store analysis results, signal breakdowns and images to file system/database to be retrieved.


     

3.	Web Dashboard:
This is a user friendly interface that displays real-time data, trading signals, bot status, and logs.
RESPONSIBILITIES:
•	Live chart display, which can be easily customized to show a live update (30s live update).
•	The stream logs and searchable historical logs in real-time.
•	PIN-secured trading operations.
•	Centralized controls to recover scripts and measures of the system.
•	Nonfunctional: rate limiting, role separation, audit logs and validation.
It helps user to monitor the system and make adjustments if needed.

  Part B (10 points): Explain how these components communicate and share data. Include: 
•	File-based data sharing mechanisms 
•	API endpoints for real-time communication 
•	Database interactions 

•	File-based data sharing mechanisms 
o	The bots save data to files (eg.docyment.txt) that other component can read. For example, the chart analysis bot might save its analysis to a file that the RL bot uses.






Part C (5 points): What are the advantages of this modular architecture compared to a monolithic trading 
Solution: 
Fault isolation: The failure of one component (e.g. OpenAI outage) does not interrupt the execution of the trade.

The analysis of independent scaling Chart (CPU/GPU heavy) can be scaled regardless of RL being executed (latency-sensitive).

Fast development and testing Components may be tested and deployed independently.

Access Control: The dashboard and API are safely locked out to ensure that they cannot be accessed unauthorized. The RL (Reinforcement Learning) service comes with an environment that is secure to store trading credentials.

Flexibility and Upgradability: This system help to easily replace or upgrade the OpenAI model or RL algorithm without the necessity to rewrite the dashboard or reprocess existing data.


	Task 2: OpenAI Chart Analysis Implementation (20 points) 
 
  Scenario: The chart analysis bot uses OpenAI GPT-4o for intelligent market analysis. 
 
  Part A (8 points): Explain the complete workflow from data fetching to AI recommendation: 
1.	Binance API data retrieval 
2.	Chart generation with technical indicators 
3.	OpenAI API integration 
4.	Result processing and storage 
 
SOLUTION: 
•	Binance API data retrieval:
o	The bot visits the Binance exchange and finds the most recent raw facts, the history of the price within the past few hours or days. The absence of new data would mean that the bot is staring at old news and trading in bad news.
•	Chart generation with technical indicators:
o	After bot has those raw numbers it works on the numbers to compute on technical indicators. The indicators are special formulas which idetifies patterns. The bot will then map all these indicator lines (such as the EMA, MACD, etc.) as a visual chart upon which the candles are plotted.
•	OpenAI API integration:
o	Instead of bot writing complex rules it uses openAI to make a decision whether to buy, sell or hold.
o	Bot sends the actual image of the chart it just drew and text message to analyze the image and tell whether to buy, sell or hold.


•	Result processing and storage:
o	The final response of the AI is saved by the bot to a central database immediately. The principal trading element, the RL-Enhanced Bot, instantly interprets this signal and then considers it to determine whether to trade or not.
o	The greatest threat is the AI malfunction or the breakage of the internet connection. The bot cannot stop working.
o	The Issue: In case the OpenAI API crashes (it is unable to find an answer), there will not be a signal to the bot.
o	The solution for those issues:
	The bot will make several attempts or do retry (the retry mechanism).
	When it still does not work, it disregards the AI during that cycle and relies on a much simpler rule-based score based on the indicators computed during Step 2.
	In case this simplified score is not strong enough (it lacks strong conviction to buy or sell), the final safety mechanism of the bot is to give a HOLD signal. It never risks going to safety but to take a blind trade.

Part B (7 points): What technical indicators are included in the chart analysis, and why might each be   valuable for trading decisions?
Technical Indicator	Full Name	Primary Purpose in Decision Making	Valuation for Trading Decisions (Detailed)
EMA	Exponential Moving Average	Trend Context & Filter	Foundation: Establishes the primary market direction. EMAs (9, 21, 50) are used as dynamic support and resistance levels. A key EMA crossover (e.g., the fast 9-period crossing the slower 21-period) is often the initial trigger signaling a change in the short-term trend direction.
MACD	Moving Average Convergence Divergence	Combined Trend & Momentum Signal	Directional Power: Highly effective for detecting both momentum strength and trend duration. Crossovers between the MACD line and the Signal line are used to confirm trend signals, providing a powerful and actionable confirmation for trade entry or exit.
RSI	Relative Strength Index	Extreme Momentum & Reversal Signal	Risk/Reversal Check: Measures the speed and change of price movements. Its main use is to detect when the asset is Overbought (above 70) or Oversold (below 30), allowing the bot to anticipate a short-term price correction or reversal.
Volume	Trading Volume	Conviction and Confirmation	Validation: Volume provides the necessary confirmation for any price signal. A strong price move (up or down) on high volume is a high-conviction signal. The AI uses volume data to determine the legitimacy of a move flagged by the other indicators.
VWAP	Volume Weighted Average Price	Intraday Benchmark & Trade Quality	Trade Quality: Represents the average price of an asset weighted by volume. It acts as a benchmark of the "true" average price paid by all traders that day. The bot uses it to gauge if a potential entry price is favorable (e.g., buying below VWAP is often desirable).

  Part C (5 points): How does the system handle potential failures in the OpenAI API calls? What fallback 
Solution: 
Handling potential failures
In case of failure in the first call to the OpenAI API (because of some connection time, server error, or the rate limiting):
The machine does not stop and logs the error immediately.

It uses a backoff mechanism which is exponential and uses a retry mechanism. This implies that this system would re-try the API call with a delay between each attempt. This will ensure that the service does not get overwhelmed, and a temporary network problem has time to fix.

Fallback Mechanism:
Solution:
In case of all retries, the system should produce a signal without the advantage of multimodal analysis of the AI.
Fallback to Rule-Based Decision: The data obtained internally by the bot based on the technical indicators (EMA, MACD, etc.) forms a signal generated by the Multi-Indicator Signal System (as could be found in Task 5). The signal of each indicator in this system is scored (e.g., +1 for a BUY signal, -1 for a SELL signal) with a weighted score.
Prioritizing the Safety (The Ultimate Fallback): In case the weighted score fails to recach the required minimum signal strength requirement (e.g. a score of 3 is necessary to be considered a trade), the system will default to an issuance of a HOLD recommendation. This precaution guarantees that the final decision that will be taken by the bot is to safeguard capital and not to make a trade, which is based on low conviction or incomplete information.


Task 3: Q-Learning Trading Model (20 points) 
Scenario: The RL bot uses Q-learning to improve trading decisions over time. 
Part A (10 points): Describe how the RL model learns from trading outcomes: 
-	State representation 
-	Action space (BUY/SELL/HOLD) 
-	Reward system based on PnL 
-	Experience replay mechanism 

The following section is a description of the basic Reinforcement Learning (RL) mechanism that the RL bot makes use of to never cease learning and fine-tuning its trading strategy according to market results.

Part A: The Learning Mechanism of the RL Model (10 points)
Having learned the RL Model, explain it using your own words (e.g., what you see on the screen).
The RL bot applies the method of Q-learning, which is a model-free method of reinforcement learning. It is a learning process involving thoughts that respond to the environment (the market) and adjust its expected value (Q-value) in performing a particular action in a particular state.
Component	Description
State Representation	The state encompasses the current market conditions that the bot observes. This includes a condensed, numerical representation of the technical indicators (such as EMA, MACD, RSI, etc.) and potentially other context like cross-asset analysis (e.g., BTC/ETH price/trend)2. 
Action Space	The set of possible actions the RL agent can take at any given time, which directly controls the trade execution: BUY, SELL, or HOLD (stay in or exit position)4. 
Reward System	The primary reward signal is based directly on the Profit and Loss (PnL) realized from a trade6. Positive PnL (profit) results in a positive reward, reinforcing the sequence of State-Action that led to the profit. Negative PnL (loss) results in a negative reward (penalty). 
Experience Replay Mechanism	The system stores past state-action-reward transitions (experiences) in a memory buffer. The agent then randomly samples from this buffer to train its Q-learning model88. This helps to break the correlation between sequential experiences, improves learning stability, and ensures continuous improvement over time99999. 




Part B: The explanation of the feature of a Smart Position Management (10 points)
Smart position management option enables the RL bot to override the primary signal (which can be produced by the Chart Analysis Bot or the Multi-Indicator System) according to the real-time PnL and the present risk exposure. This is a hybrid strategy that focuses on capital and profit maximization.
Closure on HOLD is only in instances of negative PnL:
Function: RL bot will only utilize the primary trading signal (HOLD) to leave a trade when the position is making a loss (PnL is negative).
Logic: This will not allow the bot to rush in closing a trade that is already profitable only because the market is consolidating (a HOLD signal). It uses HOLD signal to signal to consider risk but not necessarily to get out.
Holds on to profitable positions despite a change of signals:
Function: When a trade is already profitable, the RL bot may disregard an anti-optimal signal (e.g. do not sell when in the LONG position, but this is the best position call, according to the RL model).
Logic: This will enable the bot to ride the trend and take the maximum gain, provided the PnL shows a strong and sustained movement, irrespective of short-term indicators to suggest a short-term movement or reversal. This shows how the RL model is adaptive as compared to fixed rules.
Makes opposite signal PnL-based decisions:
Operation: The decision is highly dependant on the PnL of the position when the market sends a reverse signal (e.g. when the bot is in a LONG position a SELL signal is generated).
Logic: When PnL is positive then the bot can select to close the profitable position to get the gain (Take Profit). In the case of PnL being negative, the bot may tend to close the position to avoid further losses (Stop Loss), which is the equivalent of taking the opposite sign as an extremely high-conviction exit signal. This guarantees the preservation of capital is of the first priority.



  Task 4: Real-Time Dashboard Architecture (15 points) 
  Scenario: The web dashboard provides live monitoring and control capabilities. 
  Part A (8 points): Describe the real-time features implemented: 
-	Live chart display with 30-second refresh cycles 
-	Chart analysis results visualization 
-	Multi-bot status monitoring 
-	Log streaming functionality 
Solution:
  The User Interface Subsystem of the trading system is the Web Dashboard, which has basic live monitoring and control systems.
Part A: Implemented Real-Time Features (8 points)
The dashboard should enable the users to have a transparent view of the market, the analysis of the bot, and its health in real-time.
Live Chart Display with 30-Second Refresh Cycles: This chart visualization is a fundamental real-time option. It pulls the most recent data of the prices and indicators, and updates it every 30 seconds, so that the user can be looking at near-live market action of the trading pair being watched (e.g., SUI/USDC ).
OpenAI GPT-4o Chart Analysis Results Visualization: This is the dashboard that visualizes the latest Chart Analysis findings that were produced by the OpenAI GPT-4o component. Such incorporates major observations (e.g., RSI is neutral, MACD is slightly negative ) and the resultant AI analysis and recommendation (e.g., HOLD ), which gives justification to decisions.
Multi-Bot Status Monitoring: The system will monitor and show the current operational status of the multiple specialized components namely, the RL-Enhanced Trading Bot and the Chart Analysis Bot. This will enable the users to verify that the system is in operation and trading.



Log Streaming Functionality: The dashboard has live log streaming. This capability provides the transparency of operations in that it provides an audit trail by which the user can view internal events, decisions, and the details of execution of the bots in real-time.
Part B (7 points): Explain the PIN protection system: 
-	6-digit PIN validation process 
-	Rate limiting and IP tracking 
-	Security measures against brute force attacks 
Solution:
The dashboard is designed with a security layer to provide a secure decision-making context particularly when performing manual overrides or vital controls of the bot (such as the Pause/Resume option ).
6-Digit PIN Authorization Procedure: Operation of control functionalities is guarded by a 6 digit PIN. This PIN will have to be successfully verified by the system before any privileged action can take place and the unauthorized users will not be able to interfere with the live trading operations.
Rate Limiting and IP Tracking: The system uses rate limiting in order to counter automated attacks. This limits the amount of PIN validation that may be made within a given period of time by the same source. It also has the IP tracking in order to determine the origin of any action that is suspicious.
Security Measures against Brute force Attacks: In addition to rate limiting, other security measures have been designed in the system against brute force attacks. These could probably consist of longer and longer timeouts due to consecutive failures, temporary blockage of accounts and IP addresses, and a hash of the PIN with a secure hash in the database, which would render exhaustive guessing impractical.











Task 5
Part A Signal weighting system (10 pts)
Design summary

These two indicators provide a direction ( +1 is bullish, [?]1 is bearish, 0 is neutral). The weighted summation of the signals is done, and the threshold strength of 3 is required to act.

Indicators and weights:

MACD signals: +-1 point each

MACD cross over signal line: +1.

Crossing below: [?]1

VWAP signals: +-1 point

Price > VWAP (bullish): +1

Price < VWAP (bearish): [?]1

EMA signals: EMA weights of the variables and variable depend upon the length of EMA.

Short EMA (fast, e.g., 9): +-1 point (took fast momentum)

Medium EMA (e.g. 21): +-2 points (trend confirmation)

Long Moving averages (e.g. 50 or 200):+ -3 points (strong trend bias)

Sample: Medium contribution to EMA = +3, short contribution to EMA = +3, long contribution to EMA = +3.

RSI signals: +-1 point

RSI was under the oversold (e.g. 30): +1 (contrarian buy)

RSI overbought (e.g. 70): = 1[?].

Volume confirmation (option): +-1 point in case move is confirmed by volume spike.

Aggregation & threshold

Aggregate score: the amount of the sum of the points of all the indicators.

Action mapping:

score [?] +3 - Strong BUY

+1 [?] score- +3 Wait for confirmation (no trade unless otherwise possible)

score [?] [?]3 - Strong SELL

[?]3 < score [?] [?]1 - Weak SELL / Wait

score = 0 - No action / HOLD

Examples:

MACD +1 VWAP +1 EMA long +3 - Score = +5- Strong BUY.

MACD, EMA short, RSI - Score = Strong SELL.

Part B - The significance of minimum threshold (5 pts)

Removes false positives: Whipsaws occur typically as a result of individual indicator inversion; the threshold imposes agreement between the indicators.

Reduces overtrading: Larger joint signals will be implemented; reduced commissions and slippage.

Noise filtering: The majority of markets are short-run variable, the strength is noise.

Risk control: Removes position taking on weak/contradictory evidence, which minimizes the hard-to-turn actions.

Tradeoff between latency and the accuracy: Threshold lets wait to receive stronger signals which is more effective on trade expectancy but can reduce the early action capture capability.
Part B (10 points): Explain the "smart position management" feature where the RL bot: 
-	Only closes positions on HOLD signals if PnL is negative 
-	Maintains profitable positions even when signals change 
-	Makes PnL-based decisions for opposite signals 

Task 6
Sure - a more natural, more human written and yet professional sounding is provided below:

Part A - Startup Process and Scripts (5 points)

restartboth.sh Functionality

Purpose:
The restartboth.sh script provides a secure and clean one-command system to re-start both the Chart Analysis Bot and the RL Trading Bot.

How it works:

 It first checks the running processes by looking on the PID files of those processes (i.e. /var/run/chartbot.pid and /var/run/rlbot.pid).
 It will send the bots a SIGTERM signal to gracefully kill the bots provided that the bots are running and will give them time to empty their order book and save their current location.
 They are automatically killed after some duration of time to compel their killing.
 The bots are then restarted after the shutdown:

Chart Analysis Bot: opens the virtual space, calls python chartbot.py and, saves the newly created PID.
Trading Bot RL: python rlbot.py & saves PID also.
After the restart it then checks all the bots by checking their /health endpoint to make sure that all is working well. When there is a health check failure, it logs the failure and recovers to a steady state.
Personal Scripts - Bot Managing.
There are independent scripts to operate each bot, i.e., the startchart.sh, stopchart.sh, status chart.sh and the respective scripts towards the RL bot.
These scripts are in place to make sure that the environment is set up properly (has a virtual environment started, loaded with API keys, connected to a database) prior to its execution.
They also deal with the log management including the automatic log rotation to enable the files to be manageable.

Validation Dependency and Error Handling.

The scripts will perform pre-flight checks to ensure that the system is prepared before any of it is started:

 They verify which version of Python they are running and compare installed package (pip freeze) to requirements.txt.
 They ensure that the disk space and memory are adequate.
 They verify Binance and OpenAI endpoints linkage.

In the event that an error has been detected such as the missing of something or a misconfigured environment, the script will document the error and will then go on automatically pip install -r requirements.txt or will kill itself with a clear message on what it has not done.

The Reliability and Health Monitoring.

The scripts are idempotent, that is, when you can execute it a few times without necessarily spawning a number of processes or restarting bots when this is unnecessary.
Once everything is complete, they perform a little health probe, either by calling the /health endpoints, or to ensure that everything is running according to schedule, they make a small test call to their API.
Part B -Monitoring and Logging (5 pts)
Logging
All the services are centrally structured logged and the logs in the form of a JSON are sent to an ELK stack (Elasticsearch, Logstash, Kibana) or Graylog to centralize their analysis.
Local rolling logs are also available in the bots and can be inspected and debugged on the server.
Every significant action, such as trade executions, traces of decisions, and OpenAI prompt/response interactions are logged so that anyone could audit and trace all activities of the entire system.
Metrics & Monitoring
Monitor the performance and health of a system are also exposed as Prometheus metrics and they are available on each service, including:
tradecount
latencyopenaims
pnlunrealized
heartbeat

Grafana dashboards are used to consume the metrics and present significant metrics, including PnL trends, drawdowns, latency, error rates, and bot health in an at-a-glance manner.

Alerts

Automated notification rules will be turned on to be notified in PagerDuty, Slack, or email when critical limits are violated, e.g. excessive drawdown, API malfunctions, excessively slow response times or trading errors.
This will ensure that its production issues are identified and addressed in time.

Tracing

Distributed tracing (using Jaeger) is used to track requests end-to-end i.e. begin with the Chart Analysis Bot, then using OpenAI, then RL Bot, and final trade execution.
This helps in determining performance dampers and pathways of requests among the components.

Backups & Snapshots

The system also makes periodic backups and snapshots of the database together with model states which are stored in the remote and sturdy store to possess security and recuperation of the same.

Audit & Reconciliation

Regular reconciliation is conducted between exchange fills and internal trade logs.
The differences will automatically establish investigations in order to ensure the accuracy of the set up and the integrity of data in all the systems.





Task 7
The system has an automated analysis pipeline, which is executed at 15 minutes intervals, that is, at the quarter-hour point, (0:00, 0:15, 0:30, and 0:45).

Once the program has begun it first examines the current time and compares it with the time remaining to the next 15 minutes. It then spins off (sleeps) until that time so that every other subsequent run remains in time with the real world exactly.

After alignment, the program takes the entire analysis pipeline:

Retrieve information on sources of interest.

Calculate indicators and key metrics.

Create visual charts on the results.

Summarize or insight with OpenAI.

Record the in-store performance and announcements in a way that dashboard and other systems are updated.

Once finished with one cycle, the scheduler waits once more until the next quarter-hour and when the next quarter-hour comes the scheduler again initiates a new cycle. This guarantees updated information that is time synchronized.

Error Handling and Recovery

In order to make the system reliable, the error recovery is part of the workflow:

Transient errors (such as short network or API interruptions) are automatically retried with exponential backoff (that is, it waits increasingly longer before attempting a re-try).

Constant failures (e.g. OpenAI or database failures) cause a degraded mode. In this mode, the system does not complete the AI-related elements and just creates the technical indicators. It keeps releasing such incomplete findings to ensure that services are not disrupted.

Every failure has to be logged in the health metrics of the system and an alert is emitted to inform administrators.

Atomic writes attempted to be safe - the results are initially written to a temporary file and then relocated into position after they are written. This avoids the appearance of incomplete or corrupted files in the event that something crashes during its run.

A persistent message queue (such as RabbitMQ or Redis) will ensure that every analysis job will be run at least once. The employee only recognizes the completion when he or she has saved and published the results, ensuring that there is consistency in the data.

Saving and Retrieval of Results.

The results of any analysis are well formatted and placed in a convenient location:

Database storage: Every report is stored in a table called the analysis reports and it contains:

timestamp - the time in which the analysis was executed.

pair the pair of currency or data under analysis.

timeframe: the time span, the period of analysis.

indicators (JSON) - calculated technical values.

signals (JSON) trading or trend signal.

chart_path-- position of the chart image generated.

AI summary -- AI generated insight.

Model version: version of AI model used.

File artifacts: Charts generated are stored in an object storage system such as Amazon S3 or a local analog. They are connected through either the public or secure URLs which can be easily accessed by the dashboard.

Access layer:

Reward bots Based on simple API call like: dashboards and reinforcement learning (RL) bots can retrieve the latest analysis.

Instead, a publish/subscribe (pub/sub) system could be subscribed to to receive immediate notifications of the availability of new results.

Bonus task 1
Simultaneously support many trading pairs. 
Pair Worker Model 
Each pair or group of traders executes parallel and independent worker processes, and it allows the system to run in parallel and isolate faults in order to perform better. 
Worker Responsibilities 
Every worker deals with data ingestion, indicator calculation and on site RL decision loop to process data and make real time trading decisions. 
Shared Services 
Cooperation by workers consists of common resources such as object storage, centralized databases, and an analysis API, and communicating via topic channels such as analysis.pair. 
Autoscaling
 Kubernetes will allow the automatic horizontal scaling of workers along with the use of CPU or queue backlog, which will be efficient and reliable to perform Shared processing in more than one server. 
Microservices + queue: Disseminate work with the help of message broker (Kafka/RabbitMQ); consumers are the jobs of chart analysis and they can be scaled on any machine. 
Data locality: Co-locate data shards and workers in the event that the data size is enormous. Coordination: Employee leader election (e.g. etcd) when there should be one singleton instance (e.g. to restrict trading to a single RL master of a pair). 
Containerization 
The system delivers the Docker to provide the same environments and isolation of resources between workers. Kubernetes coordinates and handles the containers and makes rolling upgrades as well as smooth scaling without downtime. Paper trading simulation in real time. 
Modes Backtesting (historical) Live-sim (papers trades against order book snapshots) Hybrid (some pairs live, others paper).
Advantages
The system provides the opportunity of risk-free testing of new strategies and upgrades, end-to-end flow validation, and the system does not need real capital investment hence safe and efficient to develop and test.
Bonus task 2
Portfolio Exposure Limits
The common portfolio-level risk controls set are maximum capital allocations per trading pair and among correlated assets. This makes sure that no individual position or set of correlated positions can overexpose the portfolio and both per-asset and an overall exposure cap is used in order to keep risk under control.
Diversification Rules
The system implements diversification rules to minimize the concentration risk by putting limits on the number of positions held at any given time, and putting capped allocation to the correlated positions. This applies correlation matrix in order to make sure that highly correlated trades do not create a too much risk in the portfolio.
Stop-Loss / VaR Limits
The predetermined stop-loss limits and Value-at-Risk (VaR) limits contain the losses. As an illustration, trading may be stopped when the loss incurred on the cumulative daily bases surpasses a fixed percentage percentage, whereas VaR is applied to determine the possible tail risks and limit the anticipated downsides associated with the portfolio.
Risk Budget
A risk budget is budgeted on the various strategies and each strategy absorbs a fraction of this budget per open position. This framework is used to make sure that the strategies are run within the established risk tolerances and no one strategy monopolizes the portfolio.
Volatility-based Dynamic Position Sizing.
The position sizes are varied dynamically with the market volatility. The system determines position size using measures like the Average True Range (ATR), realized volatility, and so on to ensure the dollar risk per trade is always the same and there is a similar risk exposure in each trade.
Kelly / Modified Kelly
The system is able to use a fractional Kelly formula with volatility measures to change position sizing based on the estimated trading edge and the win rate. It is a trade size adjustment method that is mathematically informed to optimize long-term growth whilst addressing risk.
Leverage Control
The leverage is adjusted dynamically depending on the situation of the market. The system limits leverage through agents of amplification of losses and controlled exposure during high volatility or stress periods in the market.
Available APIs with External Risk Management.
The system connects with external risk engines in order to improve oversight. Stress testing and counterparty risk evaluation of portfolio snapshots are sent, and market surveillance feeds give circuit breaker or exchange-specific risk alerts. Other regulatory checks include AML/KYC triggers and reporting, which are also built in compliance APIs.
Deliverables & Report Structure.
To be documented, the suggested framework will consist of Title and Abstract, System Architecture Diagram where the components such as the Chart Bot, RL Bot, and Dashboard will be presented, and responses to all tasks with bonuses. Sample API specs, DB schema, OpenAI sample prompts, Q-learning pseudocode, and scripts, such as restartboth.sh or startchart.sh, should be described in an Appendix. Important terms such as MACD, VWAP, EMA, RSI, and ATR should be explained in the glossary.
Example OpenAI Prompt Template.
An example OpenAI prompt may ask trading recommendations in the form of JSON. An example specification of the system is:
System: You are an assistant of market analysis. Response with keys: recommendation, confidence, rationale, signal break down.
User: It gives data of pair, time frame, and last price and indicators.
User Output: Structured JSON is received with actionable insights.

