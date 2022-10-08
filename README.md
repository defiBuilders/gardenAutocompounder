# Garden Autocompounder

## Disclaimer 🛑

This project has been built by a 3rd party independent group - Defi Builders. In order to obtain the correct version please visit our telegram found at farmershouse.finance. Any other copies or modifications do not belong to us and are your responsibility as a user.
We have no intention of mistreating this service and are truly committed to providing the best value to our community.

### Setup the project:

- First clone the code to your computer (this only copies the source code and does not execute anything)

## Install git your operating system (windows or mac) 
- https://git-scm.com/downloads and run the installer

- Click green box that says 'Code' and copy the https link 

- Open a terminal or command prompt on your computer 

- Type into terminal or command prompt 
    - cd ~/Desktop
    - git clone {paste link that was copied}

- Change into the directory from the terminal 
    - cd gardenAutocompounder

## Install Node.js for either windows or macos

- Node.js: https://nodejs.org/en/download/

## Install the dependencies of the project

 - Make sure you are in the gardenAutocompounder directory.
     - npm install

## Finally start the project 

 - npm run start

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## How to use:

Once you've entered your wallet information, you will be able to select a compound rate. The compound rate is the amount of plants at which the compound action will occur. For example, if you have 2000 plants and you select a compound rate of 500, then your plant compound is set for 2500 plants and consecutively at multiples of 500 from that point on. 

First compound:
- Plants ready: 2000
- Rate: 500
- Planned to compound at: 2500

Second compound:
- Plants ready: 0
- Rate: 500
- Planned to compound at: 500

Third compound:
- Plants ready: 0
- Rate: 500
- Planned to compound at: 500

## Screenshot of the autocompounder UI:
<img width="971" alt="Screen Shot 2022-10-07 at 9 56 41 PM" src="https://user-images.githubusercontent.com/115324732/194682323-3d1a779b-25ec-4806-bbff-fb47d1c7481d.png">


