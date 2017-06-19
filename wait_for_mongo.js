var conn;
try
{
    conn = new Mongo("localhost:27017");
}
catch(Error)
{
    //print(Error);
}
while(conn===undefined)
{
    try
    {
        conn = new Mongo("localhost:27017");
    }
    catch(Error)
    {
        //print(Error);
    }
    sleep(100);
}

print("MongoDB is online");
