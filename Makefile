NBIN=$(CURDIR)/node_modules/.bin

TMP=_tmp
STATIC=_static
STATIC_JS=$(STATIC)/js
STATIC_CSS=$(STATIC)/css

RESULT_JS=$(STATIC_JS)/index.js
RESULT_CSS=$(STATIC_CSS)/index.css
RESULT_YATE=$(TMP)/template.js

JS=js/*
STYL=styl/*
YATE=yate/*

all: node_modules $(RESULT_JS) $(RESULT_CSS)

$(TMP) $(STATIC_JS) $(STATIC_CSS): %:
	mkdir -p $*

$(RESULT_CSS): $(STATIC_CSS) $(STYL)
	$(NBIN)/stylus -I styl < styl/index.styl > $@

$(RESULT_YATE): $(TMP) $(YATE)
	$(NBIN)/yate yate/index.yate > $@

$(RESULT_JS): $(STATIC_JS) $(RESULT_YATE) $(JS)
	$(NBIN)/requirer js/index.js $@

minify: $(RESULT_CSS) $(RESULT_JS)
	$(NBIN)/csso $(RESULT_CSS) $(RESULT_CSS)
	$(NBIN)/uglifyjs --overwrite $(RESULT_JS)/index.js

clean:
	rm -rf $(TMP)
	rm -rf $(STATIC)
	rm -rf node_modules/

node_modules: package.json
	npm install

.PHONY: clean minify all
