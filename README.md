##SET UP
#Requirements
Ubuntu 16.04
Nodejs v10.9.0
#Steps
- Install the last version of Nodejs
sudo apt-get install -y nodejs
- Install git
sudo apt install git
- Clone the repository
git clone -b rinkeby https://github.com/NachoPal/DChallenge
- Change to DChallenge cloned folder project
cd DChallenge
- Then the rest of the project dependencies will be installed running
npm install , as all of the needed packages are installed locally within the project.
npm install



#SECURITY
- using Library SafeMath to avoid overflow and underflow.

#DESIGN PATTERNS
Below I describe all the design patterns applied in this projects and also which of them I considered not applicable to it.

###FAIL EARLY - FAIL LOUD:
Use requires at the begining of the functions .
I do and I also I use modifiers like isOpen or isOngoing.

- RESTRICTING ACCESS: I have the Ownable contract with the onlyOwner modifier, the proxy contract is ownable as well.

- MORTAL: kill function implemented. with selfdestruct.

- WITHDRAWAL pattern

- STATE MACHINE: Not used to save GAS due to the state is already specified by reading openTime and closeTime. Cheaper reading state variables than having to depend on an external timed call as Oraclize which also would cost GAS unless having an own server dedicate to that task.

- CIRCUIT BREAKER: I use modifier whenNotPaused() from Pausable.sol of Zepelin to stop user from participating and submitting as also stopping Oraclize from closing challenges.

- SPEED BUMBP: Not used as it was found as unnecessary when already using a CIRCUIT BREAKER.


#VULNERABILITIES
- A user can withdraw ETH from another account if knows the uPort address.
Solution, create a mapping where
- The use of 'now' in verifySubmission and the modifiers challengeIsOpen and challengeIsOngoing
- Doesn't have a fallback with revert() to reject ETH.
- Cuando se ordenan los inidices de los challenges para ser cerrados se puede superar el limite del gas del block, contrlarlo con gasleft()
