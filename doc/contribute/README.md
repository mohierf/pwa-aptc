# Project documentation

## Installation and development

```sh

# Push _UID variable in your environement

echo 'export _UID=$(id -u)' >>  ~/.bashrc
```
**Note** : you need to log-out / log-in for this variable to get correctly installed in your shell -)

### Install development configuration

This step is not mandatory, the default installed files are almost always convenient. If you need to override the default docker configuration, execute: 
```bash
cp docker-compose.override.yml.dist docker-compose.override.yml
```

The _docker-compose.override.yml_ file overrides and completes the default configuration contained in _docker-compose.yml_. It is **always a bad idea** to modify the *docker-compose.yml* file!

# (Re-)Build the project

If some  new parameters are used or updated...

```bash
docker-compose build
```
**Note** that the *node_modules* and *dist* folders that are built during the image build process are not the one exposed locally on your host computer!

When the _node_ container is started, the entry point that is executed on image start executes `yarn install && yarn build` before running the container command.  

If needed, restart all the docker images from scratch:

```bash
docker system prune --all --volumes
```


# Start the project

```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.selenium.yml up -d
```

# Go to "http://localhost:3001"

# Stop the project

```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.selenium.yml down
```

You can specify a white label app
Optional arguments : BRANDING=3chealth docker-compose -f docker-compose.yml -f docker-compose.override.yml up

## Launch Nightwatch tests

Stop the project

In `docker-compose.override.yml`, replace `localhost` in the lines `- 'API_ENDPOINT=http://localhost'` 
with IP from your current VM (run `ip addr` to find it).

Restart the project

### `docker-compose exec --user "${UID}" node node_modules/.bin/nightwatch --env chrome` 

Optional command arguments : `(--test tests/menu.js --testcase homepage)`

# Development helpers

Run the code formatter

```sh
$ docker-compose exec --user "${UID}" node yarn format
```

Run the linter check

```sh
$ docker-compose exec --user "${UID}" node yarn lint
```

Run the linter with fix option

```sh
$ docker-compose exec --user "${UID}" node yarn lint-fix
```

# Unit testing

__Jest__ is used as JS Unit Testing Framework.

For testing React Component with render it will be add __Testing Library__ to __Jest__.

Jest and Testing Library are deeply and fully documented :
- [Jest Documentation](https://jestjs.io/docs/en/getting-started.html) 
- [Testing Library Documentation](https://testing-library.com/docs/intro)

In project, JS unit tests are currently localized in __tests\__ folders in __"src/"__ and __"src/shared-patient-lib/"__, but for conveniance it could be add in other locations.

__Run unit tests:__

```sh
$ docker-compose exec --user "${UID}" node yarn test
```
__Run unit tests with coverage:__

```sh
$ docker-compose exec --user "${UID}" node yarn test-coverage
```

# Themes

apTelecare comes with multiple themes presets defined in the '/shared-patient-lib/_branding.js' file.

 Each theme requires the following elements :
 - favicons folder in **/branding/themeName**
 - specific logos and stylesheets in project **/resources/images/themeName** and **/resources/css/TMM/sass/aptc/themeName.scss**
 - webpack configuration in order to build all assets in production in /webpack.config.js
 
 A theme requires 3 mandatory pictures : white logotype, colored logotype, and HD background picture (at least 1600 px wide)
 It also requires the 3 following variables :
```sh
  themeName: {
    APP_NAME: 'Brand Name',
    APP_EDITOR: 'Editor Name',
    APP_LOGOUT_TIME: 900000
  },
```

Note : Each theme comes with custom email templates with coordinated colors and logos. These emails templates and associated logotypes are defined in the API project.

# Stylesheets

apTelecare is based on a custom Bootstrap based template. Styles are defined in the **/resources/css/TMM/sass/aptc/** folder.
The folder contains either components styles or global layout styles.

The stylesheets are compiled for production using the webpack configuration file.

# Redux

The project uses redux to store data fetched from the api. Consequently the data is store based on the entities defined in the **/src/reducers** folder.

Having a new entity in your redux store must be defined as follows :

/src/actions/**apiEntityName**

Then actions are created with one file per action type. CRUD actions are defined as follows in the folder :
**create.js, delete.js, list.js, show.js, update.js** etc.

Reducers are updated by the actions contained in the **/src/actions** folder. Reducers keep the same file names as defined in your actions folder.

You can then import actions and used store data as you like from any component on your project.

Components interacting with a specific entity are created as follows :
**/src/components/ApiEntityName**

... and generally contains the following files :

**ApiEntityName/List.js** -> contains a collection of the entity (and actions to delete an entity)

**ApiEntityName/Create.js** -> contains the logic (actions and form declaration) to create a new entity

**ApiEntityName/Update.js** -> contains the logic (actions and form declaration) to update a new entity

**ApiEntityName/Form.js** -> contains the form to create, show or update an entity

# i18n

apTelecare features internationalisation of dates thanks to moment-timezone library and texts thanks to react-intl.

User is allowed to switch dynamically between available languages defined in the **/src/shared-patient-lib/lang** folder.

Dates in the app are displayed based on the user timezone and its locale.

# Project structure

## Fixtures

The fixtures folder contains the list of entities to feed the api database on which the selenium e2e tests will rely to.

To do so, copy/paste all the yml files in the api **/TestBundle/dataFixtures/ORM** folder.

Reset the database as specified on the api documentation.

## src

The folder contains all the sources files. They are organized as follow :
- /api : handles the requests between the pwa and the api
- /components : all the visual components (and their logic) displayed to the user
- /resources : stylesheets, fonts, images resources
- /shared-patient-lib : this folder contains all the logic of the patient app which are identical between throughout the aptelecare projects (redux actions and reducers, react containers, constants and functions).

# Routes

All routes in the application are defined in the /src/RootContainer.js file. Routing is based on react-router-dom dependency.

# Patient shared lib

The patient shared library is a folder containing a similar structure to the project's src folder.

## Redux reducers and actions
It contains on its own all the redux actions to fetch and store a patient's data.
## Containers
It also features a list of containers components.
This components contains only logic in order to format props for view components indenpendantly from the project it's used in.
## Translations
**/lang** folder contains all patients translated texts, separated in two folder :

- **/activities**: translations used in a patient activity and patient calendar overview (used in app-web, app-mobile and admin)
- **/patient**: remaining translations used only on app-web and app-mobile projects




