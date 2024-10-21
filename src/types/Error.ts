export interface Error {
  response?: {
      data?: {
          error?: string;
      };
  };
  message: string;
}


/* 
catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json(
            {
                error: err.message,
            },
            {
                status: 400,
            },
        );
    }



    catch (error: unknown) {
            const err = error as Error;
            window.alert(err?.message || "Error creating answer");
        }
*/