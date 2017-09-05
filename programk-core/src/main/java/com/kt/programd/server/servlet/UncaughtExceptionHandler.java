package com.kt.programd.server.servlet;

public class UncaughtExceptionHandler implements Thread.UncaughtExceptionHandler{

    /**
     * Causes the Core to fail, with information about the exception.
     * 
     * @see java.lang.Thread.UncaughtExceptionHandler#uncaughtException(Thread,
     *      Throwable)
     */
	@Override
    public void uncaughtException(Thread t, Throwable e)
    {
        System.err.println("Uncaught exception " + e.getClass().getSimpleName()
                + " in thread \"" + t.getName() + "\".");
        e.printStackTrace(System.err);
    }

}
