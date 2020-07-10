module.exports = shipit => {
  require('shipit-deploy')(shipit)

  const network = process.argv[2]

  const PM2_APP_NAME = `multiply-server`

  shipit.initConfig({
    default: {
      repositoryUrl: 'git@github.com:multiplycharity/multiply-monorepo.git',
      keepReleases: 3,
      deployTo: 'multiply/server',
      servers: '',
      branch: 'dev'
    }
  })

  shipit.blTask('installDependencies', async () => {
    await shipit.remote(
      `cd ${shipit.releasePath} && yarn cache clean && yarn install`
    )
    shipit.log('Installed yarn dependecies')
  })

  shipit.task('copyConfig', async () => {
    await shipit.copyToRemote(
      '../config/config.json',
      `multiply/${network}/current/packages/server/config/config.json`
    )
  })

  // shipit.task('build', async () => {
  //   await shipit.remote(`cd ${shipit.releasePath} && yarn build`)
  // })

  shipit.blTask('stopApp', async () => {
    try {
      await shipit.remote(
        `cd ${shipit.releasePath} && pm2 stop ${PM2_APP_NAME} && pm2 delete ${PM2_APP_NAME}`
      )
      shipit.log('Stopped app process')
    } catch (err) {
      shipit.log('No previous process to restart. Continuing.')
    }
  })

  shipit.blTask('startApp', async () => {
    await shipit.remote(
      `cd ${shipit.releasePath} && pm2 start --name ${PM2_APP_NAME} npm -- run server`
    )
    shipit.log('Started app process')
  })

  shipit.on('updated', () => {
    shipit.start(['installDependencies'])
  })

  shipit.on('published', () => {
    shipit.start(['copyConfig', 'build', 'stopApp', 'startApp'])
  })
}
