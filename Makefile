.PHONY: package

package: version
	make -C pkg package

version:
	git describe > jingles.version
	cp jingles.version dist

