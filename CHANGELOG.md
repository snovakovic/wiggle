## [0.7.0] - 2017-04-08
### Removed
- getActiveScreens method have been removed from wiggle api

## [0.6.0] - 2017-04-06
### Changed
- Make public API immutable

## [0.5.0] - 2017-03-17
### Changed
- Init is accepting array of screens and resizeDelay instead of settings object
- minor code update

### Added
- Validation for screens when calling init

## [0.3.0] - 2017-03-07
### Changed
- initialize instance with new

## [0.2.0] - 2017-02-21
### Changed
- minor refactoring of public api functions
- Move application logic to Instance method
- Change the way different measurements types are defined.

### Fixed
- off method was not working correctly
- isScreen active checker was not working when screen had both minWidth and maxWidth


## [0.1.0] - 2017-02-20
### Added
- Option to define measureUnit for screenSize

### Changed
- Code organization

### Removed
- once method (reason: same thing can be achieved with on by using once from lodash or similar library)


## [0.0.1] - 2017-02-17
- Initial version
