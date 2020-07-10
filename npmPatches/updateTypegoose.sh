#!/bin/bash

# update typegoose for supporting Long in refType
sed -i.bak 's/| typeof mongoose.Schema.Types.ObjectId;/| typeof mongoose.Schema.Types.ObjectId | typeof Long;/' node_modules/@typegoose/typegoose/lib/types.d.ts
sed -i.bak -e $'s/defaultClasses\';/defaultClasses\';\\\nimport \{ Long \} from \'bson\';/' node_modules/@typegoose/typegoose/lib/types.d.ts
sed -i.bak 's/RefType = number | string | mongoose.Types.ObjectId | Buffer;/RefType = number | string | mongoose.Types.ObjectId | Buffer | Long;/' node_modules/@typegoose/typegoose/lib/types.d.ts

# update mongoose for supporting Long

sed -i.bak -e $'s/\\* section schema\\/decimal128\\.js/\\*\\/class Long extends SchemaType \\{\\\nconstructor\\(key\\: string\\, options\\?\\: any\\);\\\ncheckRequired(value: any, doc: MongooseDocument): boolean;\\\nstatic schemaName\\: string\\;\\\n\\}\\\n\\/\\*/' node_modules/@types/mongoose/index.d.ts
