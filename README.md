Creeper
=======

* Install node.js

* Install node-osx-notifier
```[sudo] npm install [-g] node-osx-notifier```

* Command Syntax

 * 1. Basic command: 
       {echo this is some command}
  
 * 2. Notify on die/error: 
    	{echo this is some command}!
  
 *  3. Compare stndout to given string and notify you of result: 
   		{echo this is some command}(this is some command) 
  
 * 4. Compare stndout of one command to stndout of another and notify you of result: 
   		{echo this is some command}{echo compare him to me}
 
 * THE SECOND COMPARE PARAM FOR ANY OF THESE CAN BE (I AM A STRING LITERAL) 
  
 * 5. If true logic for commands: 
   		{{echo if this}{echo matches this then}}{
   			echo then run this command
   			echo and this commmand
   			echo and this command
   		}
 * 6. If false logic for commands: 
    	!{{echo if this}{echo matches this then}}{
   			echo then run this command
   			echo and this commmand
   			echo and this command
   		}
 * 4. If else logic for commands: 
   		{{echo if this}{echo matches this then}}{
   			echo then run this command
    	}{
   			echo else then run this command
   			echo and this commmand
    	}
 * 5.CommandBlock(can take the place of any singular command)
   		{echo command 1;echo command 2;echo command 3}
   OR
   		{
   			echo command 1
   	 		echo command 2
   	  		echo command 3
   		}