version = `cat package.json| grep -w version | awk -F '"' '{print $$4}'`
gitlab  = git@gitlab.alipay-inc.com:tiny-plugins/tinyjs-plugin-ui.git
github  = https://github.com/ant-tinyjs/tinyjs-plugin-ui.git

gitpush:
	@git remote set-url origin ${github}
	@git add -A .
	@git commit -am ${msg}
	@git tag -d ${version} && git tag ${version}
	@git push origin master --tags

qtdeploy:
	@git remote set-url origin ${gitlab}
	@git tag ${version}
	@git push origin master --tags
	@qtdeploy all
	@git remote set-url origin ${github}
