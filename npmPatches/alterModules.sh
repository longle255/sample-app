#!/bin/bash

# add modification for npm packages. for example:
# sed -i.bak -e $'s/\\* section schema\\/decimal128\\.js/\\*\\/class Long extends SchemaType \\{\\\nconstructor\\(key\\: string\\, options\\?\\: any\\);\\\ncheckRequired(value: any, doc: MongooseDocument): boolean;\\\nstatic schemaName\\: string\\;\\\n\\}\\\n\\/\\*/' node_modules/@types/mongoose/index.d.ts
