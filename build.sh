#--ouputHashing=all to be used for angular 10 onwards
rm -rf dist;
ng build --base-href=/ --common-chunk --vendor-chunk --optimization --progress --output-hashing=all --configuration production --aot;
cat "append-push.txt" >> "dist/steex/ngsw-worker.js"
cd dist;
rm -rf pieworksportal pieworksportal.tar.gz;
mv steex pieworksportal;
tar -cvf pieworksportal.tar pieworksportal
gzip pieworksportal.tar
